// ABOUTME: Route-level tests for the bilingual Rochester Cat Care guide.
// ABOUTME: Covers core content, R2-hosted image assets, and public-page redaction.

import { cleanup, fireEvent, render, screen, within } from '@testing-library/preact'
import type { ComponentChildren } from 'preact'
import { afterEach, describe, expect, it, vi } from 'vitest'

const R2_IMAGE_BASE_URL = 'https://photos.kwajiehao.com/rochester-cat-care/'

vi.mock('../components/Layout.tsx', () => ({
  Layout: ({ children }: { children: ComponentChildren }) => <main>{children}</main>,
}))

afterEach(() => {
  cleanup()
  document.body.style.overflow = ''
  window.history.pushState({}, '', '/')
})

describe('/rochester-cat-care', () => {
  it('renders the bilingual cat-care guide without sensitive entry-code content', async () => {
    const modulePath = './RochesterCatCarePage.tsx'
    const { RochesterCatCarePage } = await import(modulePath)

    const { container } = render(<RochesterCatCarePage />)

    expect(screen.getByRole('heading', { name: 'Rochester Cat Care' })).toBeTruthy()
    expect(screen.getByRole('button', { name: '中文' })).toBeTruthy()
    expect(screen.getAllByText('Replace litter bag').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Refresh water bowls').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Clean food bowls').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Count all cats').length).toBeGreaterThan(0)
    expect(screen.getByText('Safety first')).toBeTruthy()
    expect(
      screen.getByText('Please keep the balcony door and ziptrak closed whenever you are not actively passing through.'),
    ).toBeTruthy()
    expect(
      screen.queryByText(
        'Access details are shared directly by the owners. This page intentionally leaves out private entry information.',
      ),
    ).toBeNull()
    expect(screen.getByRole('img', { name: /three cats/i }).getAttribute('src')).toBe(
      `${R2_IMAGE_BASE_URL}cats-overview.webp`,
    )
    expect(
      screen.getByRole('img', { name: 'Bottom drawer with the used litter bag pulled out' }).getAttribute('src'),
    ).toBe(`${R2_IMAGE_BASE_URL}litter-drawer.webp`)
    expect(
      screen.getByRole('img', { name: 'Treat bag and supplies inside the kitchen cupboard' }).getAttribute('src'),
    ).toBe(`${R2_IMAGE_BASE_URL}treat-supplies.webp`)

    fireEvent.click(screen.getByRole('button', { name: '中文' }))
    expect(screen.getByRole('heading', { name: 'Rochester 猫咪照护' })).toBeTruthy()
    expect(screen.getAllByText('更换猫砂垃圾袋').length).toBeGreaterThan(0)
    expect(screen.getAllByText('清洗并补水').length).toBeGreaterThan(0)
    expect(screen.getByText('安全第一')).toBeTruthy()
    expect(screen.getByText('不进出阳台时，请保持阳台门和 ziptrak 关闭。')).toBeTruthy()
    expect(screen.queryByText('进门相关信息会由主人另外直接告知。此页面刻意不放私人出入信息。')).toBeNull()
    expect(screen.getByRole('img', { name: '三只猫在一起休息' }).getAttribute('src')).toBe(
      `${R2_IMAGE_BASE_URL}cats-overview.webp`,
    )
    expect(screen.getByRole('img', { name: '拉出的底部抽屉和用过的猫砂垃圾袋' })).toBeTruthy()
    expect(screen.getByRole('img', { name: '厨房柜子里的零食袋和用品' })).toBeTruthy()

    const text = container.textContent?.toLowerCase() ?? ''
    const html = container.innerHTML
    const imageSources = [...container.querySelectorAll('img')].map((image) => image.getAttribute('src'))
    expect(imageSources).toHaveLength(16)
    expect(imageSources.every((source) => source?.startsWith(R2_IMAGE_BASE_URL))).toBe(true)
    expect(html).not.toContain('src="/rochester-cat-care/')
    expect(text).not.toContain(['pass', 'code'].join(''))
    expect(text).not.toContain(['door', ' code'].join(''))
    expect(html).not.toContain('/rochester-cat-care/litter-chute.webp')
    expect(html).not.toContain('/rochester-cat-care/toys.webp')
  })

  it('opens each localized image in an accessible single-image viewer and restores the page on close', async () => {
    const modulePath = './RochesterCatCarePage.tsx'
    const { RochesterCatCarePage } = await import(modulePath)

    render(<RochesterCatCarePage />)

    const imageButtons = screen.getAllByRole('button', { name: /^Expand / })
    expect(imageButtons).toHaveLength(16)

    const heroTrigger = screen.getByRole('button', { name: 'Expand Three cats resting together' })
    heroTrigger.focus()
    fireEvent.click(heroTrigger)

    const dialog = screen.getByRole('dialog', { name: 'Expanded image' })
    expect(dialog.getAttribute('aria-modal')).toBe('true')
    expect(within(dialog).getByRole('img', { name: 'Three cats resting together' }).getAttribute('src')).toBe(
      `${R2_IMAGE_BASE_URL}cats-overview.webp`,
    )
    expect(screen.queryByRole('button', { name: /previous|next/i })).toBeNull()
    expect(document.body.style.overflow).toBe('hidden')

    const closeButton = screen.getByRole('button', { name: 'Close expanded image' })
    expect(document.activeElement).toBe(closeButton)

    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })
    expect(window.dispatchEvent(tabEvent)).toBe(false)
    expect(document.activeElement).toBe(closeButton)

    const shiftTabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    })
    expect(window.dispatchEvent(shiftTabEvent)).toBe(false)
    expect(document.activeElement).toBe(closeButton)

    fireEvent.click(closeButton)
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(document.body.style.overflow).toBe('')
    expect(document.activeElement).toBe(heroTrigger)

    const litterTrigger = screen.getByRole('button', { name: 'Expand Litter machine on the balcony' })
    expect(litterTrigger.tagName).toBe('BUTTON')
    fireEvent.click(litterTrigger)
    expect(screen.getByRole('dialog', { name: 'Expanded image' })).toBeTruthy()
    expect(screen.getAllByRole('img', { name: 'Litter machine on the balcony', hidden: true })).toHaveLength(2)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: '中文' }))
    const chineseTrigger = screen.getByRole('button', { name: '放大客厅里的第一个水碗' })
    fireEvent.click(chineseTrigger)
    expect(screen.getByRole('dialog', { name: '放大图片' })).toBeTruthy()
    expect(screen.getAllByRole('img', { name: '客厅里的第一个水碗', hidden: true })).toHaveLength(2)
    expect(screen.getByRole('button', { name: '关闭放大的图片' })).toBeTruthy()

    fireEvent.click(screen.getByRole('dialog', { name: '放大图片' }))
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})
