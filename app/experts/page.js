// Файл: app/experts/page.js

import usersServiceServer from "@/src/services/server/users.server";
import ExpertsPage from "@/src/features/ExpertsPage/ExpertsPage";

export const metadata = {
    title: "Naši Experti | FastCredit Forum",
    description:
        "Zoznam overených finančných expertov na FastCredit Forum. Získajte profesionálne rady od špecializovaných poradcov.",
    keywords:
        "finanční experti, odborníci, poradenstvo, FastCredit, Slovensko",
    openGraph: {
        title: "Naši Experti | FastCredit Forum",
        description:
            "Zoznam overených finančných expertov. Získajte profesionálne rady od špecializovaných poradcov.",
        type: "website",
        url: "https://fastcredit.sk/forum/experts",
    },
};

export default async function ExpertsPageServer({ searchParams }) {
    // Параметры пагинации и сортировки из URL
    const page = Number(searchParams?.page) || 1;
    const limit = Number(searchParams?.limit) || 12; // 12 экспертов на страницу (3x4 grid)
    const sortBy = searchParams?.sortBy || "rating"; // rating, totalAnswers, createdAt, firstName
    const sortOrder = searchParams?.sortOrder || "-1"; // -1 (desc), 1 (asc)

    // Загружаем экспертов с сервера
    let expertsData = { data: [], pagination: null };
    let error = null;

    try {
        console.log(`🔍 Loading experts:`, {
            page,
            limit,
            sortBy,
            sortOrder,
        });

        const result = await usersServiceServer.getExperts({
            page,
            limit,
            sortBy,
            sortOrder: parseInt(sortOrder),
        });

        // Проверяем структуру ответа
        if (result && typeof result === "object") {
            expertsData = {
                data: Array.isArray(result.data) ? result.data : [],
                pagination: result.pagination || {
                    current: page,
                    limit,
                    total: 0,
                    totalItems: 0,
                    hasNext: false,
                    hasPrev: false,
                },
            };
        }

        console.log(`✅ Experts loaded:`, {
            expertsCount: expertsData.data?.length || 0,
            pagination: expertsData.pagination,
        });
    } catch (loadError) {
        console.error("❌ Failed to load experts:", loadError);
        error = "Nepodarilo sa načítať expertov. Skúste to znovu.";

        // Fallback структура при ошибке
        expertsData = {
            data: [],
            pagination: {
                current: 1,
                limit: 12,
                total: 0,
                totalItems: 0,
                hasNext: false,
                hasPrev: false,
            },
        };
    }

    // Передаем все данные в клиентский компонент
    return (
        <ExpertsPage
            initialExperts={expertsData.data}
            initialPagination={expertsData.pagination}
            initialFilters={{
                page,
                limit,
                sortBy,
                sortOrder,
            }}
            error={error}
        />
    );
}