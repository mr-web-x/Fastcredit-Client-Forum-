// Додати функцію в початок компонента:
export const decodeHtmlEntities = (text) => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
};

// <p>
//     {decodeHtmlEntities(paragraph)}
// </p>