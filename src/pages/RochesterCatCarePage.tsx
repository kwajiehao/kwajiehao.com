// ABOUTME: Public bilingual cat-care guide for trusted Rochester caregivers.
// ABOUTME: Presents static visit steps with local Notion-derived photos and no saved checklist state.

import { useEffect, useMemo, useRef, useState } from 'preact/hooks'
import { Layout } from '../components/Layout.tsx'

type Locale = 'en' | 'zh-Hans'

interface LocalizedText {
  en: string
  'zh-Hans': string
}

interface CareImage {
  src: string
  alt: LocalizedText
}

interface CareSection {
  id: string
  eyebrow: LocalizedText
  title: LocalizedText
  summary: LocalizedText
  steps: LocalizedText[]
  images: CareImage[]
  note?: LocalizedText
}

const locales: Array<{ id: Locale; label: string }> = [
  { id: 'en', label: 'EN' },
  { id: 'zh-Hans', label: '中文' },
]

const cats = ['Xiao Li Ba', 'Hua Hua', 'Wu Kong']
const IMAGE_BASE_URL = 'https://photos.kwajiehao.com/rochester-cat-care/'

const overviewImage: CareImage = {
  src: `${IMAGE_BASE_URL}cats-overview.webp`,
  alt: {
    en: 'Three cats resting together',
    'zh-Hans': '三只猫在一起休息',
  },
}

const sections: CareSection[] = [
  {
    id: 'litter',
    eyebrow: { en: 'Step 1', 'zh-Hans': '步骤 1' },
    title: { en: 'Replace litter bag', 'zh-Hans': '更换猫砂垃圾袋' },
    summary: {
      en: 'Swap the used bag from the litter machine and dispose of it at the rubbish chute.',
      'zh-Hans': '请更换猫砂机里的垃圾袋，并把用过的袋子丢到垃圾槽。',
    },
    steps: [
      {
        en: 'Go to the balcony through the living room and find the litter machine.',
        'zh-Hans': '从客厅进入阳台，找到猫砂机。',
      },
      {
        en: 'Use the replacement plastic bags stored next to the machine.',
        'zh-Hans': '新的塑料袋放在猫砂机旁边。',
      },
      {
        en: 'Tie the used bag securely before carrying it out.',
        'zh-Hans': '把用过的袋子扎紧后再拿出去。',
      },
      {
        en: 'Dispose of it at the rubbish chute outside the apartment.',
        'zh-Hans': '请把它丢到公寓外的垃圾槽。',
      },
    ],
    images: [
      {
        src: `${IMAGE_BASE_URL}litter-machine.webp`,
        alt: {
          en: 'Litter machine on the balcony',
          'zh-Hans': '阳台上的猫砂机',
        },
      },
      {
        src: `${IMAGE_BASE_URL}litter-bag.webp`,
        alt: {
          en: 'Replacement litter bags beside the machine',
          'zh-Hans': '猫砂机旁边的新垃圾袋',
        },
      },
      {
        src: `${IMAGE_BASE_URL}litter-detail.webp`,
        alt: {
          en: 'Close-up of the litter bag area',
          'zh-Hans': '猫砂垃圾袋位置近照',
        },
      },
      {
        src: `${IMAGE_BASE_URL}litter-drawer.webp`,
        alt: {
          en: 'Bottom drawer with the used litter bag pulled out',
          'zh-Hans': '拉出的底部抽屉和用过的猫砂垃圾袋',
        },
      },
    ],
  },
  {
    id: 'water',
    eyebrow: { en: 'Step 2', 'zh-Hans': '步骤 2' },
    title: { en: 'Refresh water bowls', 'zh-Hans': '清洗并补水' },
    summary: {
      en: 'Clean and refill all four water bowls around the home.',
      'zh-Hans': '请清洗并补满家里的四个水碗。',
    },
    steps: [
      {
        en: 'There are two water bowls in the living room.',
        'zh-Hans': '客厅有两个水碗。',
      },
      {
        en: 'There is one water bowl on the balcony.',
        'zh-Hans': '阳台有一个水碗。',
      },
      {
        en: 'There is one water bowl in the master bedroom.',
        'zh-Hans': '主卧有一个水碗。',
      },
      {
        en: 'Wash each bowl and refill it with clean water.',
        'zh-Hans': '请清洗每个碗，并重新装满干净的水。',
      },
    ],
    images: [
      {
        src: `${IMAGE_BASE_URL}water-bowl-living-room-1.webp`,
        alt: {
          en: 'First living room water bowl',
          'zh-Hans': '客厅里的第一个水碗',
        },
      },
      {
        src: `${IMAGE_BASE_URL}water-bowl-living-room-2.webp`,
        alt: {
          en: 'Second living room water bowl',
          'zh-Hans': '客厅里的第二个水碗',
        },
      },
      {
        src: `${IMAGE_BASE_URL}water-bowl-balcony.webp`,
        alt: {
          en: 'Balcony water bowl',
          'zh-Hans': '阳台上的水碗',
        },
      },
      {
        src: `${IMAGE_BASE_URL}water-bowl-bedroom.webp`,
        alt: {
          en: 'Bedroom water bowl',
          'zh-Hans': '卧室里的水碗',
        },
      },
    ],
  },
  {
    id: 'food',
    eyebrow: { en: 'Step 3', 'zh-Hans': '步骤 3' },
    title: { en: 'Clean food bowls', 'zh-Hans': '清洗并补粮' },
    summary: {
      en: 'Clean the food bowls, dry them well, and return any remaining food.',
      'zh-Hans': '请清洗食碗，擦干后再把剩余食物放回去。',
    },
    steps: [
      {
        en: 'There are two food areas, both in the living room.',
        'zh-Hans': '两个放食物的位置都在客厅。',
      },
      {
        en: 'If food is still in the bowls, move it temporarily into the red bowl.',
        'zh-Hans': '如果碗里还有食物，可以先倒进红色临时碗。',
      },
      {
        en: 'Wash the bowls and dry them with paper towels from the kitchen island.',
        'zh-Hans': '清洗食碗后，用厨房岛台上的纸巾擦干。',
      },
      {
        en: 'Return the food only after the bowls are dry.',
        'zh-Hans': '碗干了以后再把食物放回去。',
      },
    ],
    images: [
      {
        src: `${IMAGE_BASE_URL}food-bowls-1.webp`,
        alt: {
          en: 'First food bowl area in the living room',
          'zh-Hans': '客厅里的第一个食物区域',
        },
      },
      {
        src: `${IMAGE_BASE_URL}food-bowls-2.webp`,
        alt: {
          en: 'Second food bowl area in the living room',
          'zh-Hans': '客厅里的第二个食物区域',
        },
      },
    ],
  },
  {
    id: 'roll-call',
    eyebrow: { en: 'Step 4', 'zh-Hans': '步骤 4' },
    title: { en: 'Count all cats', 'zh-Hans': '确认三只猫都在家' },
    summary: {
      en: 'Before leaving, find Xiao Li Ba, Hua Hua, and Wu Kong.',
      'zh-Hans': '离开前，请确认 Xiao Li Ba、Hua Hua 和 Wu Kong 都在家。',
    },
    steps: [
      {
        en: 'Check the common resting and hiding spots shown in the photos.',
        'zh-Hans': '请对照照片检查它们常休息或躲藏的位置。',
      },
      {
        en: 'Also look around the balcony, kitchen island, and guest-room cupboard.',
        'zh-Hans': '也可以检查阳台、厨房岛台附近，以及客房柜子里。',
      },
      {
        en: 'A quick photo or video update is very appreciated if they are comfortable.',
        'zh-Hans': '如果猫咪愿意露面，也很欢迎你拍照片或视频发给我们。',
      },
    ],
    images: [
      {
        src: `${IMAGE_BASE_URL}cat-count-spot-1.webp`,
        alt: {
          en: 'Common cat resting spot',
          'zh-Hans': '猫咪常待的位置',
        },
      },
      {
        src: `${IMAGE_BASE_URL}cat-count-spot-2.webp`,
        alt: {
          en: 'Common cat hiding spot',
          'zh-Hans': '猫咪常躲的位置',
        },
      },
      {
        src: `${IMAGE_BASE_URL}cat-count-spot-3.webp`,
        alt: {
          en: 'Another common cat spot to check',
          'zh-Hans': '另一个需要检查的猫咪位置',
        },
      },
    ],
    note: {
      en: 'The most important final check is simple: all three cats are safely inside.',
      'zh-Hans': '最重要的离开前检查很简单：三只猫都安全在家。',
    },
  },
  {
    id: 'play',
    eyebrow: { en: 'Optional', 'zh-Hans': '可选' },
    title: { en: 'Treats and optional play', 'zh-Hans': '零食和可选陪玩' },
    summary: {
      en: 'This is only if they are comfortable. They may be shy with visitors.',
      'zh-Hans': '这一步完全可选。它们见到访客可能会害羞。',
    },
    steps: [
      {
        en: 'Treats are available in the kitchen cupboard.',
        'zh-Hans': '零食在厨房柜子里。',
      },
      {
        en: 'If they are too shy to eat, it is fine to leave the treat out.',
        'zh-Hans': '如果它们太害羞不敢吃，可以把零食留下来。',
      },
      {
        en: 'Cat toys are on the sofa and floor if they feel like playing.',
        'zh-Hans': '沙发上和地上有玩具，猫咪愿意的话可以陪它们玩一下。',
      },
    ],
    images: [
      {
        src: `${IMAGE_BASE_URL}treats.webp`,
        alt: {
          en: 'Cat treats in the kitchen cupboard',
          'zh-Hans': '厨房柜子里的猫咪零食',
        },
      },
      {
        src: `${IMAGE_BASE_URL}treat-supplies.webp`,
        alt: {
          en: 'Treat bag and supplies inside the kitchen cupboard',
          'zh-Hans': '厨房柜子里的零食袋和用品',
        },
      },
    ],
  },
]

const copy = {
  en: {
    title: 'Rochester Cat Care',
    kicker: 'Cat Visit Guide',
    intro:
      'Thank you for helping care for Xiao Li Ba, Hua Hua, and Wu Kong. This is a step-by-step guide on how you can take care of our cats. If you have any unaswered questions please contact us!',
    houseRuleTitle: 'House Rules',
    houseRule:
      'Please keep the balcony door in the living room and second bedroom slightly open so that the cats can go pee. Please make sure the ziptrak in the balcony stays closed for their safety.',
    catsTitle: 'Cat roll call',
    catsSummary: 'Before leaving, make sure all three cats are safely inside.',
    sectionsTitle: 'Visit sections',
    guideTitle: 'Care guide',
    next: 'Next',
    backToTop: 'Back to sections',
    languageLabel: 'Language',
    expandImage: 'Expand',
    expandedImage: 'Expanded image',
    closeExpandedImage: 'Close expanded image',
  },
  'zh-Hans': {
    title: 'Rochester 猫咪照护',
    kicker: '猫咪探访指南',
    intro:
      '谢谢你帮忙照顾 Xiao Li Ba、Hua Hua 和 Wu Kong。这是一份关于如何照顾我们家猫咪的分步骤指南。如果有任何没有解答的问题，请联系我们！',
    houseRuleTitle: '家中注意事项',
    houseRule: '请将客厅和第二间卧室通往阳台的门保持微开，让猫咪可以去阳台上厕所。为了它们的安全，请确保阳台的 Ziptrak 始终保持关闭。',
    catsTitle: '猫咪点名',
    catsSummary: '离开前，请确认三只猫都安全在家。',
    sectionsTitle: '照护步骤',
    guideTitle: '照护指南',
    next: '下一步',
    backToTop: '回到步骤列表',
    languageLabel: '语言',
    expandImage: '放大',
    expandedImage: '放大图片',
    closeExpandedImage: '关闭放大的图片',
  },
} satisfies Record<Locale, Record<string, string>>

function localize(value: LocalizedText, locale: Locale) {
  return value[locale]
}

function getExpandLabel(alt: string, locale: Locale) {
  return locale === 'en' ? `${copy.en.expandImage} ${alt}` : `${copy['zh-Hans'].expandImage}${alt}`
}

function SectionImage({
  image,
  locale,
  onOpen,
}: {
  image: CareImage
  locale: Locale
  onOpen: (image: CareImage, trigger: HTMLButtonElement) => void
}) {
  const alt = localize(image.alt, locale)

  return (
    <figure class="min-w-0">
      <button
        type="button"
        aria-label={getExpandLabel(alt, locale)}
        onClick={(event) => onOpen(image, event.currentTarget)}
        class="block w-full cursor-zoom-in border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
      >
        <img
          src={image.src}
          alt={alt}
          loading="lazy"
          class="aspect-[4/5] w-full border border-[var(--color-border)] object-cover lg:aspect-[4/3]"
        />
      </button>
    </figure>
  )
}

export function RochesterCatCarePage() {
  const [locale, setLocale] = useState<Locale>('en')
  const [selectedImage, setSelectedImage] = useState<CareImage | null>(null)
  const imageTriggerRef = useRef<HTMLButtonElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const t = copy[locale]

  const sectionNav = useMemo(() => sections.map((section) => ({
    id: section.id,
    label: localize(section.title, locale),
    eyebrow: localize(section.eyebrow, locale),
  })), [locale])

  const openImage = (image: CareImage, trigger: HTMLButtonElement) => {
    imageTriggerRef.current = trigger
    setSelectedImage(image)
  }

  useEffect(() => {
    if (!selectedImage) return

    const previousOverflow = document.body.style.overflow
    const trigger = imageTriggerRef.current
    const handleModalKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedImage(null)
      } else if (event.key === 'Tab') {
        event.preventDefault()
        closeButtonRef.current?.focus()
      }
    }

    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    window.addEventListener('keydown', handleModalKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleModalKeyDown)
      if (trigger && document.contains(trigger)) trigger.focus()
    }
  }, [selectedImage])

  return (
    <Layout maxWidth="wide">
      <article class="py-10 md:py-14" lang={locale}>
        <header class="grid gap-8 border-b border-[var(--color-border)] pb-10 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,26rem)] lg:items-end">
          <div class="min-w-0">
            <p class="mb-3 text-sm font-medium uppercase tracking-[0.08em] text-[var(--color-muted)]">
              {t.kicker}
            </p>
            <h1 class="text-4xl font-bold leading-tight md:text-5xl">
              {t.title}
            </h1>
            <p class="mt-5 max-w-2xl text-base leading-7 text-[var(--color-muted)]">
              {t.intro}
            </p>
          </div>
          <div class="min-w-0">
            <div class="mb-4 flex items-center justify-start gap-2 lg:justify-end" aria-label={t.languageLabel}>
              {locales.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={locale === option.id}
                  onClick={() => setLocale(option.id)}
                  class={`border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] ${
                    locale === option.id
                      ? 'border-[var(--color-accent)] bg-[var(--color-text)] text-[var(--color-bg)]'
                      : 'border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-code-bg)]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              aria-label={getExpandLabel(localize(overviewImage.alt, locale), locale)}
              onClick={(event) => openImage(overviewImage, event.currentTarget)}
              class="block w-full cursor-zoom-in border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
            >
              <img
                src={overviewImage.src}
                alt={localize(overviewImage.alt, locale)}
                class="aspect-[16/10] w-full border border-[var(--color-border)] object-cover"
              />
            </button>
          </div>
        </header>

        <section class="grid gap-4 border-b border-[var(--color-border)] py-6 md:grid-cols-2">
          <div class="border border-[var(--color-border)] bg-[var(--color-code-bg)] p-5">
            <h2 class="text-base font-semibold">{t.houseRuleTitle}</h2>
            <p class="mt-2 text-sm leading-6 text-[var(--color-muted)]">{t.houseRule}</p>
          </div>
          <div class="border border-[var(--color-border)] p-5">
            <h2 class="text-base font-semibold">{t.catsTitle}</h2>
            <p class="mt-2 text-sm leading-6 text-[var(--color-muted)]">{t.catsSummary}</p>
            <ul class="mt-4 flex flex-wrap gap-2" aria-label={t.catsTitle}>
              {cats.map((cat) => (
                <li key={cat} class="border border-[var(--color-border)] px-3 py-1.5 text-sm">
                  {cat}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="sections" class="grid gap-8 py-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-12">
          <aside class="lg:sticky lg:top-6 lg:self-start">
            <h2 class="mb-4 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">
              {t.sectionsTitle}
            </h2>
            <nav aria-label={t.sectionsTitle}>
              <ol class="space-y-2">
                {sectionNav.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      class="block border border-[var(--color-border)] px-4 py-3 text-sm transition-colors hover:bg-[var(--color-code-bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                    >
                      <span class="block text-xs uppercase tracking-[0.08em] text-[var(--color-muted)]">
                        {section.eyebrow}
                      </span>
                      <span class="mt-1 block font-medium">{section.label}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <div class="min-w-0">
            <h2 class="sr-only">{t.guideTitle}</h2>
            <div class="space-y-12 lg:space-y-8">
              {sections.map((section, index) => {
                const nextSection = sections[index + 1]

                return (
                  <section
                    key={section.id}
                    id={section.id}
                    class="scroll-mt-6 border-t border-[var(--color-border)] pt-8 lg:pt-6"
                    aria-labelledby={`${section.id}-title`}
                  >
                    <p class="text-sm font-medium uppercase tracking-[0.08em] text-[var(--color-muted)]">
                      {localize(section.eyebrow, locale)}
                    </p>
                    <div class="mt-2 grid gap-6 lg:grid-cols-1">
                      <div class="min-w-0 lg:max-w-[65ch]">
                        <h3 id={`${section.id}-title`} class="text-2xl font-bold leading-tight md:text-3xl">
                          {localize(section.title, locale)}
                        </h3>
                        <p class="mt-3 max-w-2xl text-base leading-7 text-[var(--color-muted)]">
                          {localize(section.summary, locale)}
                        </p>
                        <ol class="mt-6 space-y-3">
                          {section.steps.map((step, stepIndex) => (
                            <li key={stepIndex} class="grid grid-cols-[2rem_minmax(0,1fr)] gap-3">
                              <span
                                aria-hidden="true"
                                class="flex h-8 w-8 items-center justify-center border border-[var(--color-border)] text-sm font-semibold"
                              >
                                {stepIndex + 1}
                              </span>
                              <span class="pt-1 text-sm leading-6">{localize(step, locale)}</span>
                            </li>
                          ))}
                        </ol>
                        {section.note && (
                          <p class="mt-6 border-l-2 border-[var(--color-accent)] pl-4 text-sm leading-6 text-[var(--color-muted)]">
                            {localize(section.note, locale)}
                          </p>
                        )}
                        <div class="mt-7 flex flex-wrap gap-3 text-sm">
                          <a
                            href="#sections"
                            class="border border-[var(--color-border)] px-4 py-2 transition-colors hover:bg-[var(--color-code-bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                          >
                            {t.backToTop}
                          </a>
                          {nextSection && (
                            <a
                              href={`#${nextSection.id}`}
                              class="border border-[var(--color-accent)] bg-[var(--color-text)] px-4 py-2 text-[var(--color-bg)] transition-opacity hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                              style={{ color: 'var(--color-bg)' }}
                            >
                              {t.next}: {localize(nextSection.title, locale)}
                            </a>
                          )}
                        </div>
                      </div>
                      <div class="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                        {section.images.map((image) => (
                          <SectionImage key={image.src} image={image} locale={locale} onOpen={openImage} />
                        ))}
                      </div>
                    </div>
                  </section>
                )
              })}
            </div>
          </div>
        </section>
        {selectedImage && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t.expandedImage}
            class="fixed inset-0 z-50 flex h-[100dvh] w-screen items-center justify-center overflow-hidden bg-black/90 p-4"
            onClick={(event) => {
              if (event.target === event.currentTarget) setSelectedImage(null)
            }}
          >
            <button
              ref={closeButtonRef}
              type="button"
              aria-label={t.closeExpandedImage}
              onClick={() => setSelectedImage(null)}
              class="absolute right-3 top-3 z-10 flex h-11 w-11 cursor-pointer items-center justify-center border-0 bg-black/50 text-white transition-colors hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-4 sm:top-4"
            >
              <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <img
              src={selectedImage.src}
              alt={localize(selectedImage.alt, locale)}
              class="max-h-[calc(100dvh-2rem)] max-w-[calc(100vw-2rem)] select-none object-contain"
            />
          </div>
        )}
      </article>
    </Layout>
  )
}
