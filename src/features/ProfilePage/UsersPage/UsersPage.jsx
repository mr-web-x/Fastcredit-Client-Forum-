"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  changeUserRoleAction,
  banUserAction,
  unbanUserAction,
} from "@/app/actions/users";
import UserCard from "./UserCard/UserCard";
import Pagination from "@/src/components/Pagination/Pagination";
import "./UsersPage.scss";

export default function UsersPage({
  user,
  initialUsers = [],
  initialPagination = null,
  initialFilters = {},
  error: initialError = null,
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // State только для поискового запроса (для debounce)
  const [searchQuery, setSearchQuery] = useState(initialFilters.search || "");
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Server-side навигация для фильтров (кроме поиска)
  const handleFilterChange = useCallback(
    (key, value) => {
      const params = new URLSearchParams();

      // Сохраняем все текущие фильтры
      Object.entries(initialFilters).forEach(([filterKey, filterValue]) => {
        if (filterValue && filterKey !== "page" && filterKey !== key) {
          params.set(filterKey, filterValue.toString());
        }
      });

      // Добавляем новый фильтр
      if (value) {
        params.set(key, value.toString());
      }

      const newURL = `/forum/profile/users${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      router.replace(newURL);
    },
    [initialFilters, router]
  );

  // Обработка поиска с debounce (единственная client-side операция)
  const handleSearchChange = useCallback(
    (searchValue) => {
      setSearchQuery(searchValue);

      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      const newTimeout = setTimeout(() => {
        const params = new URLSearchParams();

        // Сохраняем все фильтры кроме search и page
        Object.entries(initialFilters).forEach(([key, val]) => {
          if (val && key !== "page" && key !== "search") {
            params.set(key, val.toString());
          }
        });

        // Добавляем поисковый запрос
        if (searchValue.trim()) {
          params.set("search", searchValue.trim());
        }

        const newURL = `/forum/profile/users${
          params.toString() ? `?${params.toString()}` : ""
        }`;
        router.replace(newURL);
      }, 800);

      setSearchTimeout(newTimeout);
    },
    [initialFilters, router, searchTimeout]
  );

  // Очистка таймера
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  // Действия с пользователями (с revalidation)
  const handleChangeUserRole = useCallback(async (userId, newRole, reason) => {
    startTransition(async () => {
      try {
        const result = await changeUserRoleAction(userId, newRole, reason);

        if (result?.success) {
          console.log("✅ Rola používateľa zmenená");
          // revalidation обновит данные автоматически
        } else {
          alert(result?.error || "Chyba pri zmene role");
        }
      } catch (error) {
        console.error("Failed to change user role:", error);
        alert("Chyba pri zmene role používateľa");
      }
    });
  }, []);

  const handleBanUser = useCallback(async (userId, banData) => {
    startTransition(async () => {
      try {
        const result = await banUserAction(userId, banData);

        if (result?.success) {
          console.log("✅ Používateľ zablokovaný");
        } else {
          alert(result?.error || "Chyba pri blokovaní");
        }
      } catch (error) {
        console.error("Failed to ban user:", error);
        alert("Chyba pri blokovaní používateľa");
      }
    });
  }, []);

  const handleUnbanUser = useCallback(async (userId) => {
    startTransition(async () => {
      try {
        const result = await unbanUserAction(userId);

        if (result?.success) {
          console.log("✅ Používateľ odblokovaný");
        } else {
          alert(result?.error || "Chyba pri odblokovaní");
        }
      } catch (error) {
        console.error("Failed to unban user:", error);
        alert("Chyba pri odblokovaní používateľa");
      }
    });
  }, []);

  return (
    <div className="users-page">
      {/* Header */}
      <div className="users-page__header">
        <div className="users-page__title-section">
          <h1 className="users-page__title">Správa používateľov</h1>
          <p className="users-page__subtitle">
            Celkový počet používateľov: {initialPagination?.totalItems || 0}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="users-page__controls">
        <div className="users-page__filters">
          <div className="users-page__filters-selects">
            {/* Фильтр по роли */}
            <select
              value={initialFilters.role || ""}
              onChange={(e) => handleFilterChange("role", e.target.value)}
              className="users-page__filter-select"
              disabled={isPending}
            >
              <option value="">Všetci používatelia</option>
              <option value="user">Používatelia</option>
              <option value="expert">Experti</option>
              <option value="lawyer">Právnici</option>
              <option value="moderator">Moderátori</option>
              <option value="admin">Administrátori</option>
            </select>

            {/* Фильтр по статусу */}
            <select
              value={initialFilters.isActive || ""}
              onChange={(e) => handleFilterChange("isActive", e.target.value)}
              className="users-page__filter-select"
              disabled={isPending}
            >
              <option value="">Všetky statusy</option>
              <option value="true">Aktívni</option>
              <option value="false">Zablokovaní</option>
            </select>
          </div>

          {/* Поиск с debounce */}
          <input
            type="text"
            placeholder="Hľadať podľa mena alebo emailu..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="users-page__search-input"
            disabled={isPending}
          />
        </div>
      </div>

      {/* Error State */}
      {initialError && (
        <div className="users-page__error">
          <span className="users-page__error-icon">⚠️</span>
          {initialError}
        </div>
      )}

      {/* Loading State */}
      {isPending && (
        <div className="users-page__loading">
          <span className="users-page__loading-spinner"></span>
          Načítava sa...
        </div>
      )}

      {/* Users List */}
      <div className="users-page__list">
        {initialUsers.length > 0
          ? initialUsers.map((targetUser) => (
              <UserCard
                key={targetUser._id}
                targetUser={targetUser}
                currentUser={user}
                onChangeRole={handleChangeUserRole}
                onBan={handleBanUser}
                onUnban={handleUnbanUser}
                disabled={isPending}
              />
            ))
          : !isPending && (
              <div className="users-page__empty">
                <h3 className="users-page__empty-title">
                  Žiadni používatelia neboli nájdení
                </h3>
                <p className="users-page__empty-text">
                  Skúste zmeniť filtre alebo vyhľadávací dotaz
                </p>
              </div>
            )}
      </div>

      {/* Pagination */}
      {initialPagination && initialPagination.total > 1 && (
        <div className="users-page__pagination">
          <Pagination
            pagination={initialPagination}
            currentFilters={initialFilters}
            basePath="/forum/profile/users"
          />
        </div>
      )}
    </div>
  );
}
