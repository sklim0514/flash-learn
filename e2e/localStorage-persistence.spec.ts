import { test, expect } from '@playwright/test'

test.describe('localStorage 지속성', () => {
  test('초기 데이터가 localStorage에 저장된다', async ({ page }) => {
    await page.goto('/')
    
    // localStorage에 데이터가 저장되었는지 확인
    const decks = await page.evaluate(() => {
      return localStorage.getItem('fc.decks')
    })
    
    expect(decks).toBeTruthy()
    
    const decksData = JSON.parse(decks!)
    expect(decksData).toHaveLength(1)
    expect(decksData[0].id).toBe('travel')
    expect(decksData[0].title).toBe('여행(Travel)')
    expect(decksData[0].size).toBe(20)
    
    // 카드 데이터 확인
    const cards = await page.evaluate(() => {
      return localStorage.getItem('fc.cards')
    })
    
    expect(cards).toBeTruthy()
    
    const cardsData = JSON.parse(cards!)
    expect(cardsData).toHaveLength(20)
    expect(cardsData[0].front_en).toBe('passport')
    expect(cardsData[0].back_ko).toBe('여권')
  })

  test('페이지 새로고침 후에도 덱 데이터가 유지된다', async ({ page }) => {
    // 홈 페이지 방문
    await page.goto('/')
    
    // 덱이 표시되는지 확인
    await expect(page.getByText('여행(Travel)')).toBeVisible()
    await expect(page.getByText('카드 수: 20개')).toBeVisible()
    
    // 페이지 새로고침
    await page.reload()
    
    // 새로고침 후에도 덱 데이터 유지 확인
    await expect(page.getByText('여행(Travel)')).toBeVisible()
    await expect(page.getByText('카드 수: 20개')).toBeVisible()
  })

  test('학습 페이지에서 새로고침해도 카드가 로드된다', async ({ page }) => {
    // 홈에서 시작하여 localStorage 초기화
    await page.goto('/')
    await expect(page.getByText('여행(Travel)')).toBeVisible()
    
    // 학습 페이지로 이동
    await page.goto('/study?deck=travel')
    
    // 첫 번째 카드 로드 대기
    await page.waitForLoadState('networkidle')
    await expect(page.getByText('passport')).toBeVisible()
    await expect(page.getByText('1 / 20')).toBeVisible()
    
    // 몇 개 카드 진행
    await page.getByRole('button', { name: '다음 →' }).click()
    await page.getByRole('button', { name: '다음 →' }).click()
    await page.getByRole('button', { name: '다음 →' }).click()
    
    // 페이지 새로고침
    await page.reload()
    
    // 새로고침 후 첫 번째 카드로 리셋되는지 확인
    // (현재는 세션 복구 기능이 없으므로 첫 카드로 돌아감)
    await expect(page.getByText('passport')).toBeVisible()
    await expect(page.getByText('1 / 20')).toBeVisible()
  })

  test('localStorage를 수동으로 삭제하면 초기 데이터가 다시 로드된다', async ({ page }) => {
    await page.goto('/')
    
    // localStorage 삭제
    await page.evaluate(() => {
      localStorage.clear()
    })
    
    // 페이지 새로고침
    await page.reload()
    
    // 초기 데이터가 다시 로드되어 표시됨
    await expect(page.getByText('여행(Travel)')).toBeVisible()
    await expect(page.getByText('카드 수: 20개')).toBeVisible()
    
    // localStorage에 데이터가 다시 저장되었는지 확인
    const decks = await page.evaluate(() => {
      return localStorage.getItem('fc.decks')
    })
    
    expect(decks).toBeTruthy()
  })
})

