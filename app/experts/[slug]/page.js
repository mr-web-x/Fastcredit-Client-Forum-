// Файл: app/experts/[slug]/page.js

import { notFound } from "next/navigation";
import { getServerUser } from "@/src/lib/auth-server";
import usersServiceServer from "@/src/services/server/users.server";
import ExpertProfilePage from "@/src/features/ExpertProfilePage/ExpertProfilePage";

// Генерация metadata для SEO
export async function generateMetadata({ params }) {
    try {
        const { slug } = params;
        const expertData = await usersServiceServer.getExpertProfileBySlug(slug);

        if (!expertData || !expertData.data) {
            return {
                title: "Expert nebol nájdený | FastCredit Forum",
            };
        }

        const expert = expertData.data;
        const fullName = `${expert.firstName || ""} ${expert.lastName || ""}`.trim();

        return {
            title: `${fullName} - Expert | FastCredit Forum`,
            description: `${fullName} je overený finančný expert s ratingom ${expert.rating?.toFixed(1) || "0.0"
                }/5. ${expert.totalAnswers || 0} odpovedí. Pozrite si profil a položte vlastnú otázku.`,
            keywords: `${fullName}, finančný expert, poradenstvo, FastCredit, odborník, ${expert.role === "admin" ? "admin," : ""
                } Slovensko`,
            openGraph: {
                title: `${fullName} - Expert | FastCredit Forum`,
                description: `Overený finančný expert s ratingom ${expert.rating?.toFixed(1) || "0.0"
                    }/5. ${expert.totalAnswers || 0} odpovedí.`,
                type: "profile",
                url: `https://fastcredit.sk/forum/experts/${slug}`,
            },
        };
    } catch (error) {
        console.error("Error generating metadata:", error);
        return {
            title: "Expert | FastCredit Forum",
        };
    }
}

export default async function ExpertProfilePageServer({ params }) {
    const { slug } = params;

    // Получаем текущего пользователя (опционально)
    const user = await getServerUser();

    // Загружаем профиль эксперта с сервера
    let expertData = null;
    let error = null;

    try {
        console.log(`🔍 Loading expert profile for slug: ${slug}`);

        expertData = await usersServiceServer.getExpertProfileBySlug(slug);

        if (!expertData) {
            console.warn(`⚠️ Expert not found: ${slug}`);
            notFound();
        }

        // Проверяем что это действительно эксперт
        if (
            !expertData.role ||
            !["expert", "admin"].includes(expertData.role.toLowerCase())
        ) {
            console.warn(`⚠️ User ${slug} is not an expert`);
            notFound();
        }

        console.log(`✅ Expert profile loaded:`, {
            name: `${expertData.firstName} ${expertData.lastName}`,
            role: expertData.role,
            rating: expertData.rating,
            totalAnswers: expertData.totalAnswers,
            recentAnswersCount: expertData.recentAnswers?.length || 0,
            bestAnswersCount: expertData.bestAnswers?.length || 0,
        });
    } catch (loadError) {
        console.error("❌ Failed to load expert profile:", loadError);

        // Если 404 от сервера - показываем notFound
        if (loadError.response?.status === 404 || loadError.status === 404) {
            notFound();
        }

        // Другие ошибки
        error = "Nepodarilo sa načítať profil experta. Skúste to znovu.";
        expertData = null;
    }

    // Если нет данных после всех попыток - 404
    if (!expertData) {
        notFound();
    }

    // Передаем данные в клиентский компонент
    return <ExpertProfilePage user={user} expert={expertData} error={error} />;
}