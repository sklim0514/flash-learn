import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FlashCard from '../FlashCard'
import { Card } from '../../types'

describe('FlashCard', () => {
  const mockCard: Card = {
    id: 't1',
    deckId: 'travel',
    front_en: 'passport',
    back_ko: '여권'
  }

  it('앞면이 표시된다', () => {
    const onFlip = vi.fn()
    render(<FlashCard card={mockCard} isFlipped={false} onFlip={onFlip} />)
    
    expect(screen.getByText('passport')).toBeInTheDocument()
    expect(screen.getByText('영어')).toBeInTheDocument()
  })

  it('뒷면이 표시된다', () => {
    const onFlip = vi.fn()
    render(<FlashCard card={mockCard} isFlipped={true} onFlip={onFlip} />)
    
    expect(screen.getByText('여권')).toBeInTheDocument()
    expect(screen.getByText('한국어')).toBeInTheDocument()
  })

  it('카드를 클릭하면 onFlip이 호출된다', async () => {
    const user = userEvent.setup()
    const onFlip = vi.fn()
    
    render(<FlashCard card={mockCard} isFlipped={false} onFlip={onFlip} />)
    
    const card = screen.getByText('passport').closest('div')?.parentElement?.parentElement
    if (card) {
      await user.click(card)
      expect(onFlip).toHaveBeenCalledTimes(1)
    }
  })

  it('뒤집기 상태에 따라 CSS 클래스가 변경된다', () => {
    const onFlip = vi.fn()
    const { rerender } = render(
      <FlashCard card={mockCard} isFlipped={false} onFlip={onFlip} />
    )
    
    // 앞면일 때
    let cardElement = screen.getByText('passport').closest('div')?.parentElement
    expect(cardElement?.className).not.toContain('rotate-y-180')
    
    // 뒷면으로 변경
    rerender(<FlashCard card={mockCard} isFlipped={true} onFlip={onFlip} />)
    cardElement = screen.getByText('여권').closest('div')?.parentElement
    expect(cardElement?.className).toContain('rotate-y-180')
  })

  it('여러 카드를 렌더링할 수 있다', () => {
    const cards: Card[] = [
      { id: 't1', deckId: 'travel', front_en: 'passport', back_ko: '여권' },
      { id: 't2', deckId: 'travel', front_en: 'ticket', back_ko: '티켓' }
    ]
    
    const onFlip = vi.fn()
    
    const { rerender } = render(
      <FlashCard card={cards[0]} isFlipped={false} onFlip={onFlip} />
    )
    expect(screen.getByText('passport')).toBeInTheDocument()
    
    rerender(<FlashCard card={cards[1]} isFlipped={false} onFlip={onFlip} />)
    expect(screen.getByText('ticket')).toBeInTheDocument()
    expect(screen.queryByText('passport')).not.toBeInTheDocument()
  })

  it('"카드를 클릭하여 뒤집기" 안내 메시지가 표시된다', () => {
    const onFlip = vi.fn()
    render(<FlashCard card={mockCard} isFlipped={false} onFlip={onFlip} />)
    
    expect(screen.getAllByText('카드를 클릭하여 뒤집기')).toHaveLength(2)
  })
})

