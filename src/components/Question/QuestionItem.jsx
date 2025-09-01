import "./QuestionItem.scss";

export default function QuestionItem({ question }) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "/forum";
  const href = `${base}/(public)/question/${question._id}`;

  return (
    <article className="q-item">
      <div className="q-item__meta">
        <span title="Лайки">👍 {question.likesCount ?? 0}</span>
        <span title="Ответы">💬 {question.answersCount ?? 0}</span>
      </div>

      <a className="q-item__title" href={href}>
        {question.title}
      </a>

      {question.content && (
        <p className="q-item__excerpt">{question.content}</p>
      )}

      <div className="q-item__footer">
        {question.category && (
          <span className="q-item__tag">{question.category}</span>
        )}
        {question.createdAt && (
          <time className="q-item__time">
            {new Date(question.createdAt).toLocaleDateString("sk-SK")}
          </time>
        )}
      </div>
    </article>
  );
}
