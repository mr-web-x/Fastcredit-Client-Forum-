// Файл: src/features/ProfilePage/UsersPage/UsersPage.jsx

"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getUsersAction,
  changeUserRoleAction,
  banUserAction,
  unbanUserAction,
} from "@/app/actions/users";
import UserCard from "./UserCard/UserCard";
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

  // State для данных
  const [users, setUsers] = useState(initialUsers);
  const [pagination, setPagination] = useState(initialPagination);
  const [error, setError] = useState(initialError);

  // State для фильтров
  const [filters, setFilters] = useState({
    role: initialFilters.role || "",
    isActive: initialFilters.isActive || "",
    search: initialFilters.search || "",
    page: initialFilters.page || 1,
    limit: initialFilters.limit || 20,
    sortBy: initialFilters.sortBy || "createdAt",
  });

  // State для поискового запроса (отдельно от фильтров для debounce)
  const [searchQuery, setSearchQuery] = useState(initialFilters.search || "");

  // Таймер для debounce
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Обновление URL при изменении фильтров
  const updateURL = useCallback(
    (newFilters) => {
      const params = new URLSearchParams();

      if (newFilters.page > 1) params.set("page", newFilters.page.toString());
      if (newFilters.role) params.set("role", newFilters.role);
      if (newFilters.isActive !== "")
        params.set("isActive", newFilters.isActive);
      if (newFilters.search) params.set("search", newFilters.search);
      if (newFilters.sortBy !== "createdAt")
        params.set("sortBy", newFilters.sortBy);
      if (newFilters.limit !== 20)
        params.set("limit", newFilters.limit.toString());

      const newURL = `/forum/profile/users${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      router.replace(newURL, { scroll: false });
    },
    [router]
  );

  // Загрузка пользователей через Server Action
  const loadUsers = useCallback(
    async (newFilters = filters) => {
      startTransition(async () => {
        try {
          setError(null);

          const result = await getUsersAction(newFilters);

          if (result.success) {
            setUsers(result.data.items);
            setPagination(result.data.pagination);
          } else {
            setError(result.error);
            setUsers([]);
            setPagination(null);
          }
        } catch (loadError) {
          console.error("Failed to load users:", loadError);
          setError("Nepodarilo sa načítať používateľov. Skúste to znovu.");
        }
      });
    },
    [filters]
  );

  // Обработка изменения фильтров
  const handleFilterChange = useCallback(
    (key, value) => {
      const newFilters = { ...filters, [key]: value, page: 1 };
      setFilters(newFilters);
      updateURL(newFilters);
      loadUsers(newFilters);
    },
    [filters, updateURL, loadUsers]
  );

  // Обработка изменения поискового запроса с debounce
  const handleSearchChange = useCallback(
    (searchValue) => {
      setSearchQuery(searchValue);

      // Очищаем предыдущий таймер
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      // Устанавливаем новый таймер с задержкой 500ms
      const newTimeout = setTimeout(() => {
        const newFilters = { ...filters, search: searchValue, page: 1 };
        setFilters(newFilters);
        updateURL(newFilters);
        loadUsers(newFilters);
      }, 800);

      setSearchTimeout(newTimeout);
    },
    [filters, updateURL, loadUsers, searchTimeout]
  );

  // Очищаем таймер при размонтировании компонента
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  // Обработка смены страницы
  const handlePageChange = useCallback(
    (page) => {
      const newFilters = { ...filters, page };
      setFilters(newFilters);
      updateURL(newFilters);
      loadUsers(newFilters);
    },
    [filters, updateURL, loadUsers]
  );

  // Смена роли пользователя
  const handleChangeUserRole = useCallback(
    async (userId, newRole, reason) => {
      startTransition(async () => {
        const result = await changeUserRoleAction(userId, newRole, reason);

        if (result.success) {
          // Перезагружаем список пользователей
          await loadUsers(filters);
        } else {
          setError(result.error);
        }
      });
    },
    [filters, loadUsers]
  );

  // Бан пользователя
  const handleBanUser = useCallback(
    async (userId, banData) => {
      startTransition(async () => {
        const result = await banUserAction(userId, banData);

        if (result.success) {
          await loadUsers(filters);
        } else {
          setError(result.error);
        }
      });
    },
    [filters, loadUsers]
  );

  // Разбан пользователя
  const handleUnbanUser = useCallback(
    async (userId) => {
      startTransition(async () => {
        const result = await unbanUserAction(userId);

        if (result.success) {
          await loadUsers(filters);
        } else {
          setError(result.error);
        }
      });
    },
    [filters, loadUsers]
  );

  return (
    <div className="users-page">
      {/* Заголовок */}
      <div className="users-page__header">
        <div className="users-page__title-section">
          <h1 className="users-page__title">Správa používateľov</h1>
          <p className="users-page__subtitle">
            Celkový počet používateľov: {pagination?.totalItems || 0}
          </p>
        </div>
      </div>

      {/* Фильтры и поиск */}
      <div className="users-page__controls">
        {/* Фильтры */}
        <div className="users-page__filters">
          <div className="users-page__filters-selects">
            {/* Фильтр по роли */}
            <select
              value={filters.role}
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
              value={filters.isActive}
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

      {/* Сообщение об ошибке */}
      {error && (
        <div className="users-page__error">
          <span className="users-page__error-icon">⚠️</span>
          {error}
        </div>
      )}

      {/* Loading состояние */}
      {isPending && (
        <div className="users-page__loading">
          <span className="users-page__loading-spinner"></span>
          Načítava sa...
        </div>
      )}

      {/* Список пользователей */}
      <div className="users-page__list">
        {users.length > 0
          ? users.map((targetUser) => (
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

      {/* Пагинация */}
      {pagination && pagination.totalPages > 1 && (
        <div className="users-page__pagination">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={!pagination.hasPrev || isPending}
            className="users-page__pagination-button"
          >
            ← Predchádzajúca
          </button>

          <div className="users-page__pagination-info">
            Strana {pagination.page} z {pagination.totalPages}
          </div>

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={!pagination.hasNext || isPending}
            className="users-page__pagination-button"
          >
            Nasledujúca →
          </button>
        </div>
      )}
    </div>
  );
}
