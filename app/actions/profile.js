// Файл: app/actions/profile.js

"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getServerUser } from "@/src/lib/auth-server";

/**
 * Server Action для обновления личных данных пользователя
 */
export async function updateMyDataAction(prevState, formData) {
  try {
    // Проверяем авторизацию
    const currentUser = await getServerUser();
    if (!currentUser) {
      redirect(`/forum/login`);
    }

    // Получаем данные из формы
    const action = formData.get("action")?.toString();

    if (action !== "update_profile") {
      return {
        success: false,
        error: "Neplatná akcia",
        fieldErrors: null,
      };
    }

    const username = formData.get("username")?.toString().trim();
    const bio = formData.get("bio")?.toString().trim();
    const website = formData.get("website")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const phone = formData.get("phone")?.toString().trim();

    // Отримуємо соціальні мережі
    const socialsCount = parseInt(formData.get("socials_count") || "0");
    const socials = [];

    for (let i = 0; i < socialsCount; i++) {
      const social = formData.get(`social_${i}`)?.toString().trim();
      if (social) {
        socials.push(social);
      }
    }

    // Серверная валидация
    const fieldErrors = {};

    // ===== ВАЛИДАЦИЯ USERNAME =====
    if (!username || username.length === 0) {
      fieldErrors.username = "Používateľské meno je povinné";
    } else if (username.length < 3) {
      fieldErrors.username = "Používateľské meno musí mať aspoň 3 znaky";
    } else if (username.length > 30) {
      fieldErrors.username = "Používateľské meno môže mať maximálne 30 znakov";
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      fieldErrors.username =
        "Používateľské meno môže obsahovať len písmená, číslice a podčiarkovník";
    }

    // ===== ВАЛИДАЦИЯ BIO =====
    if (bio && bio.length > 8000) {
      fieldErrors.bio = "Popis môže mať maximálne 8000 znakov";
    }

    // ===== ВАЛИДАЦИЯ WEBSITE =====
    if (website) {
      if (!website.startsWith("http://") && !website.startsWith("https://")) {
        fieldErrors.website = "URL musí začínať http:// alebo https://";
      } else {
        try {
          const urlObj = new URL(website);
          if (!urlObj.hostname || urlObj.hostname.length < 3) {
            fieldErrors.website = "Neplatný názov domény";
          }
          if (website.length > 500) {
            fieldErrors.website = "URL je príliš dlhá (max 500 znakov)";
          }
        } catch (e) {
          fieldErrors.website = "Neplatná URL adresa";
        }
      }
    }

    // ===== ВАЛИДАЦИЯ EMAIL =====
    if (email) {
      const emailRegex = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!emailRegex.test(email)) {
        fieldErrors.email = "Neplatný formát emailu (text@domain.com)";
      } else {
        if (email.length > 254) {
          fieldErrors.email = "Email je príliš dlhý (max 254 znakov)";
        } else {
          const [localPart, domain] = email.split("@");
          if (localPart.length > 64) {
            fieldErrors.email = "Neplatný email";
          }
        }
      }
    }

    // ===== ВАЛИДАЦИЯ PHONE =====
    if (phone) {
      const cleanPhone = phone.replace(/\s/g, "");

      if (!cleanPhone.startsWith("+421")) {
        fieldErrors.phone = "Telefónne číslo musí začínať +421";
      } else {
        const phoneDigits = cleanPhone.substring(4);

        if (phoneDigits.length !== 9) {
          fieldErrors.phone = "Slovenské číslo musí mať 9 číslic po +421";
        } else if (!/^\d{9}$/.test(phoneDigits)) {
          fieldErrors.phone = "Telefónne číslo môže obsahovať iba číslice";
        } else {
          const firstDigit = phoneDigits[0];
          if (firstDigit !== "9") {
            fieldErrors.phone = "Slovenské mobilné čísla začínajú 9";
          }
        }
      }
    }

    // ===== ВАЛИДАЦИЯ SOCIALS =====
    if (socials.length > 5) {
      fieldErrors.socials = "Môžete pridať maximálne 5 sociálnych sietí";
    }

    // Валідація кожної соціальної мережі
    socials.forEach((social, index) => {
      if (!social.startsWith("http://") && !social.startsWith("https://")) {
        fieldErrors[`social_${index}`] =
          "URL musí začínať http:// alebo https://";
      } else {
        try {
          const urlObj = new URL(social);
          if (!urlObj.hostname || urlObj.hostname.length < 3) {
            fieldErrors[`social_${index}`] = "Neplatný názov domény";
          }
          if (social.length > 500) {
            fieldErrors[`social_${index}`] = "URL je príliš dlhá";
          }
        } catch (e) {
          fieldErrors[`social_${index}`] = "Neplatná URL adresa";
        }
      }
    });

    // Якщо є помилки валідації, повертаємо їх
    if (Object.keys(fieldErrors).length > 0) {
      return {
        success: false,
        error: null,
        fieldErrors,
      };
    }

    // API запрос
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

    const cookieStore = cookies();
    const jwtCookie = cookieStore.get("fc_jwt");

    if (!jwtCookie?.value) {
      redirect(`/forum/login`);
    }

    // Готуємо дані для відправки
    const updateData = {
      username,
      bio: bio || "",
      contacts: {
        socials: socials, // додаємо масив соціальних мереж
      },
    };

    // Додаємо опціональні поля тільки якщо вони заповнені
    if (website) {
      updateData.contacts.website = website;
    }
    if (email) {
      updateData.contacts.email = email;
    }
    if (phone) {
      updateData.contacts.phone = phone;
    }

    const response = await fetch(`${backendUrl}/auth/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${jwtCookie.value}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify(updateData),
    });

    // Безопасный парсинг JSON
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error("[updateMyDataAction] JSON parse error:", jsonError);
      return {
        success: false,
        error: "Neplatná odpoveď zo servera",
        fieldErrors: null,
      };
    }

    // Обработка ошибок от API
    if (!response.ok || !data.success) {
      if (response.status === 409) {
        return {
          success: false,
          error: null,
          fieldErrors: {
            username: "Toto používateľské meno už existuje",
          },
        };
      }

      if (response.status === 401) {
        redirect(`/forum/login`);
      }

      if (response.status === 403) {
        return {
          success: false,
          error: "Nemáte oprávnenie na túto akciu",
          fieldErrors: null,
        };
      }

      if (response.status === 429) {
        return {
          success: false,
          error: "Príliš veľa pokusov. Skúste neskôr.",
          fieldErrors: null,
        };
      }

      if (data.fieldErrors) {
        return {
          success: false,
          error: null,
          fieldErrors: data.fieldErrors,
        };
      }

      return {
        success: false,
        error: data.message || "Nepodarilo sa aktualizovať profil",
        fieldErrors: null,
      };
    }

    // Успех! Обновляем кеш
    try {
      revalidatePath("/forum/profile");
      revalidatePath("/forum/profile/my-data");
      revalidatePath("/forum/", "layout");
    } catch (revalidateError) {
      console.warn("[updateMyDataAction] Revalidate error:", revalidateError);
    }

    return {
      success: true,
      error: null,
      message: "Profil bol úspešne aktualizovaný",
      fieldErrors: null,
    };
  } catch (error) {
    console.error("[updateMyDataAction] Error:", error);

    if (error.name === "TypeError" && error.message.includes("fetch")) {
      return {
        success: false,
        error: "Problém s pripojením k serveru. Skúste to znovu.",
        fieldErrors: null,
      };
    }

    return {
      success: false,
      error: "Neočakávaná chyba servera. Skúste to znovu.",
      fieldErrors: null,
    };
  }
}
