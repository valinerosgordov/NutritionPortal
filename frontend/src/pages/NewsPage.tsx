import { useState, useCallback } from 'react';

const NEWS_ITEMS = [
  {
    date: '12.02.2026',
    source: 'ТАСС',
    sourceUrl: 'https://tass.ru/obschestvo/23315285',
    image: '/images/news/nutrition-health.jpg',
    title: 'В РФ появилась федерация, которая позволит узаконить отрасль нутрициологии',
    text: 'Приоритетом в работе организации назвали защиту потребителя и продвижение доказательного подхода в вопросах питания и профилактики заболеваний. Федерация специалистов превентивного здоровья и питания была зарегистрирована как автономная некоммерческая организация, целью которой является формирование профессиональных стандартов и создание единого реестра сертифицированных нутрициологов.',
    tags: ['Нутрициология', 'Законодательство', 'Стандарты'],
  },
  {
    date: '12.02.2026',
    source: 'МедВестник',
    sourceUrl: 'https://medvestnik.ru/content/news/V-Rossii-zaregistrirovana-Federaciya-specialistov-preventivnogo-zdorovya-i-pitaniya.html',
    image: '/images/news/medicine-research.jpg',
    title: 'В России зарегистрирована Федерация специалистов превентивного здоровья и питания',
    text: 'Организация планирует участвовать в разработке профстандарта нутрициолога, аккредитации обучения профильных врачей и защите потребителей. Среди ключевых направлений деятельности — развитие цивилизованного рынка wellness-услуг, БАД и функционального питания, а также повышение уровня грамотности населения в области здорового образа жизни.',
    tags: ['Медицина', 'Профстандарт', 'Образование'],
  },
  {
    date: '05.03.2026',
    source: 'Федерация',
    sourceUrl: '#',
    image: '/images/news/certification.jpg',
    title: 'Федерация запускает программу сертификации нутрициологов',
    text: 'Новая программа сертификации позволит специалистам подтвердить свою квалификацию и войти в единый реестр проверенных нутрициологов. Это важный шаг к формированию единых профессиональных стандартов в отрасли.',
    tags: ['Сертификация', 'Нутрициология', 'Реестр'],
  },
  {
    date: '10.03.2026',
    source: 'Федерация',
    sourceUrl: '#',
    image: '/images/news/forum-conference.jpg',
    title: 'Первый всероссийский форум превентивного здоровья пройдёт в Москве',
    text: 'Форум объединит ведущих экспертов в области нутрициологии, превентивной медицины и здорового образа жизни для обсуждения актуальных вопросов отрасли. В программе — доклады, мастер-классы и панельные дискуссии.',
    tags: ['Форум', 'Превентивная медицина', 'Москва'],
  },
];

export default function NewsPage() {
  const [brokenImages, setBrokenImages] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(0);
  const perPage = 2;
  const totalPages = Math.ceil(NEWS_ITEMS.length / perPage);

  const goPrev = useCallback(() => setPage(p => Math.max(0, p - 1)), []);
  const goNext = useCallback(() => setPage(p => Math.min(totalPages - 1, p + 1)), [totalPages]);

  const visibleItems = NEWS_ITEMS.slice(page * perPage, page * perPage + perPage);

  return (
    <div className="page-news">
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <span className="badge badge--light">Новости</span>
          <h1 className="page-header__title">Лента новостей</h1>
          <p className="page-header__subtitle">
            Актуальные новости о деятельности Федерации и событиях в отрасли превентивного здоровья
          </p>
        </div>
      </section>

      {/* News Carousel */}
      <section className="section section--light">
        <div className="container">
          <div className="news-carousel">
            <div className="news-carousel__grid">
              {visibleItems.map((item, i) => {
                const globalIndex = page * perPage + i;
                return (
                  <article className="news-carousel__card" key={globalIndex}>
                    {item.image && !brokenImages.has(globalIndex) && (
                      <div className="news-carousel__image">
                        <img
                          src={item.image}
                          alt={item.title}
                          onError={() => setBrokenImages(prev => new Set(prev).add(globalIndex))}
                        />
                      </div>
                    )}
                    <div className="news-carousel__body">
                      <div className="news-carousel__meta">
                        <span className="news-carousel__date">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                          {item.date}
                        </span>
                        <a
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="news-carousel__source news-carousel__source--link"
                        >
                          {item.source}
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                        </a>
                      </div>
                      <h2 className="news-carousel__title">{item.title}</h2>
                      <p className="news-carousel__text news-carousel__text--full">{item.text}</p>
                      <div className="news-carousel__tags">
                        {item.tags.map((tag, j) => (
                          <span className="news-carousel__tag" key={j}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="news-carousel__nav">
                <button
                  className="news-carousel__btn"
                  onClick={goPrev}
                  disabled={page === 0}
                  aria-label="Предыдущие новости"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>

                <div className="news-carousel__dots">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      className={`news-carousel__dot${i === page ? ' news-carousel__dot--active' : ''}`}
                      onClick={() => setPage(i)}
                      aria-label={`Страница ${i + 1}`}
                    />
                  ))}
                </div>

                <button
                  className="news-carousel__btn"
                  onClick={goNext}
                  disabled={page === totalPages - 1}
                  aria-label="Следующие новости"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
