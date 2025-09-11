// Получение инициалов пользователя
export const getUserInitials = (author) => {
  if (!author) return "?";
  if (author.firstName && author.lastName) {
    return `${author.firstName[0]}${author.lastName[0]}`.toUpperCase();
  }
  if (author.firstName) return author.firstName[0].toUpperCase();
  if (author.username) return author.username[0].toUpperCase();
  return "U";
};

// Получение отображаемого имени
export const getDisplayName = (author) => {
  if (!author) return "Neznámy používateľ";
  if (author.firstName && author.lastName) {
    return `${author.firstName} ${author.lastName}`;
  }
  if (author.firstName) return author.firstName;
  if (author.username) return author.username;
  return "Anonym";
};

// Получение бейджа роли
export const getRoleBadge = (role) => {
  const roleConfig = {
    expert: { label: "Expert", className: "author-info__role-badge--expert" },
    lawyer: {
      label: "Právnik",
      className: "author-info__role-badge--lawyer",
    },
    admin: {
      label: "Administrátor",
      className: "author-info__role-badge--admin",
    },
    moderator: {
      label: "Moderátor",
      className: "author-info__role-badge--moderator",
    },
    user: { label: "", className: "" },
  };

  return roleConfig[role] || roleConfig.user;
};
