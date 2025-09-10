// Файл: src/hooks/useOptimisticUpdates.js

"use client";

import { useState, useCallback, useRef } from "react";

/**
 * Хук для оптимистичных обновлений массивов данных
 * Позволяет мгновенно обновлять UI, а затем синхронизироваться с сервером
 */
export function useOptimisticUpdates(initialData = []) {
  const [data, setData] = useState(initialData);

  // Добавление элемента в начало массива
  const add = useCallback((newItem) => {
    setData((prevData) => [newItem, ...prevData]);
  }, []);

  // Обновление конкретного элемента по ID
  const update = useCallback((itemId, updatedItem) => {
    setData((prevData) =>
      prevData.map((item) =>
        item._id === itemId || item.id === itemId
          ? { ...item, ...updatedItem }
          : item
      )
    );
  }, []);

  // Удаление элемента по ID
  const remove = useCallback((itemId) => {
    setData((prevData) =>
      prevData.filter((item) => item._id !== itemId && item.id !== itemId)
    );
  }, []);

  // Массовое обновление с функцией
  const updateMany = useCallback((updateFunction) => {
    setData((prevData) => updateFunction(prevData));
  }, []);

  // Замена всех данных
  const replace = useCallback((newData) => {
    setData(newData);
  }, []);

  // Сброс к исходным данным
  const reset = useCallback(() => {
    setData(initialData);
  }, [initialData]);

  return [
    data,
    {
      add,
      update,
      remove,
      updateMany,
      replace,
      reset,
    },
  ];
}

/**
 * Специализированный хук для лайков
 * Упрощает работу с лайками в любых компонентах
 */
export function useLike(initialState = { likes: 0, isLiked: false }) {
  const [likeState, setLikeState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  // Используем ref для сохранения предыдущего состояния
  const previousStateRef = useRef(likeState);

  const toggleLike = useCallback(
    async (likeAction) => {
      if (isLoading) return;

      setIsLoading(true);

      // Сохраняем текущее состояние перед изменением
      previousStateRef.current = { ...likeState };

      // Оптимистичное обновление через функциональное обновление
      setLikeState((prev) => {
        const newIsLiked = !prev.isLiked;
        return {
          likes: prev.likes + (newIsLiked ? 1 : -1),
          isLiked: newIsLiked,
        };
      });

      try {
        // Вызываем переданный Server Action
        const result = await likeAction();

        if (result.success) {
          // Синхронизируем с реальными данными с сервера
          setLikeState({
            likes: result.data.likes,
            isLiked: result.data.isLiked,
          });
        } else {
          // Откат при ошибке к предыдущему состоянию
          setLikeState(previousStateRef.current);
          throw new Error(result.error);
        }
      } catch (error) {
        // Откат при ошибке к предыдущему состоянию
        setLikeState(previousStateRef.current);
        console.error("Like action failed:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading] // Убрана зависимость от likeState
  );

  return {
    likes: likeState.likes,
    isLiked: likeState.isLiked,
    isLoading,
    toggleLike,
  };
}

/**
 * Хук для управления состоянием формы с оптимистичной отправкой
 */
export function useOptimisticForm(initialValues = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback(
    (field, value) => {
      setValues((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Очищаем ошибку для этого поля
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: null,
        }));
      }
    },
    [errors]
  );

  const setError = useCallback((field, error) => {
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  const submit = useCallback(
    async (submitAction, optimisticUpdate = null) => {
      if (isSubmitting) return;

      setIsSubmitting(true);
      clearErrors();

      try {
        // Оптимистичное обновление если предоставлено
        if (optimisticUpdate && typeof optimisticUpdate === "function") {
          optimisticUpdate(values);
        }

        // Выполняем Server Action
        const result = await submitAction(values);

        if (result.success) {
          // Успех - сбрасываем форму
          reset();
          return result;
        } else {
          // Обрабатываем ошибки
          if (result.fieldErrors) {
            setErrors(result.fieldErrors);
          } else if (result.error) {
            setError("general", result.error);
          }

          throw new Error(result.error || "Form submission failed");
        }
      } catch (error) {
        // Ошибка - показываем пользователю
        if (!errors.general && !Object.keys(errors).length) {
          setError("general", error.message || "Неизвестная ошибка");
        }
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, isSubmitting, errors, reset, clearErrors]
  );

  return {
    values,
    errors,
    isSubmitting,
    setValue,
    setError,
    clearErrors,
    reset,
    submit,
  };
}
