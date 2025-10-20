import { decode } from 'he';
// Додати функцію в початок компонента:
export const decodeHtmlEntities = (text) => {
    if (!text) return text;
    return decode(text);
};

// <p>
//     {decodeHtmlEntities(paragraph)}
// </p>