import { test, expect } from '@playwright/test'

test.describe('기본 학습 플로우', () => {
  test.beforeEach(async ({ page }) => {
    // localStorage 초기화
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test('사용자가 홈에서 덱을 선택하고 카드를 학습할 수 있다', async ({ page }) => {
    // 1. 홈 페이지 접속
    await page.goto('/')
    
    // 2. "Flash Learn" 제목 확인
    await expect(page.getByRole('heading', { name: 'Flash Learn' })).toBeVisible()
    
    // 3. "여행(Travel)" 덱 확인
    await expect(page.getByText('여행(Travel)')).toBeVisible()
    
    // 4. 카드 수 확인
    await expect(page.getByText('카드 수: 20개')).toBeVisible()
    
    // 5. "학습 시작" 버튼 클릭
    await page.getByRole('button', { name: '학습 시작' }).click()
    
    // 6. Study 페이지로 이동 확인
    await expect(page).toHaveURL(/\/study\?deck=travel/)
    
    // 7. 학습 제목 확인
    await expect(page.getByRole('heading', { name: '학습' })).toBeVisible()
    
    // 8. 진행률 "1 / 20" 확인
    await expect(page.getByText('1 / 20')).toBeVisible()
    
    // 9. 첫 번째 카드 "passport" 표시 확인
    await expect(page.getByText('passport')).toBeVisible()
    
    // 카드 컨테이너 내부의 "영어" 레이블 확인
    const cardContainer = page.locator('.perspective-1000')
    await expect(cardContainer.locator('text=영어').first()).toBeVisible()
    
    // 10. 카드 클릭하여 뒤집기
    await cardContainer.click()
    
    // 11. 한국어 면 "여권" 표시 확인
    await expect(page.getByText('여권')).toBeVisible()
    await expect(cardContainer.locator('text=한국어').first()).toBeVisible()
    
    // 12. 다시 클릭하여 앞면으로
    await cardContainer.click()
    await expect(page.getByText('passport')).toBeVisible()
    
    // 13. "다음 →" 버튼 클릭
    await page.getByRole('button', { name: '다음 →' }).click()
    
    // 14. 두 번째 카드 확인
    await expect(page.getByText('boarding pass')).toBeVisible()
    
    // 15. 진행률 "2 / 20" 확인
    await expect(page.getByText('2 / 20')).toBeVisible()
    
    // 16. "← 이전" 버튼으로 돌아가기
    await page.getByRole('button', { name: '← 이전' }).click()
    
    // 17. 다시 첫 번째 카드 확인
    await expect(page.getByText('passport')).toBeVisible()
    await expect(page.getByText('1 / 20')).toBeVisible()
  })

  test('첫 번째 카드에서 이전 버튼이 비활성화된다', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: '학습 시작' }).click()
    
    // 첫 카드에서 "← 이전" 버튼 비활성화 확인
    const prevButton = page.getByRole('button', { name: '← 이전' })
    await expect(prevButton).toBeDisabled()
  })

  test('마지막 카드에서 다음 버튼이 비활성화되고 완료 버튼이 표시된다', async ({ page }) => {
    // 홈에서 시작하여 localStorage 초기화
    await page.goto('/')
    await expect(page.getByText('여행(Travel)')).toBeVisible()
    
    // 학습 페이지로 이동
    await page.goto('/study?deck=travel')
    
    // 첫 카드 로드 대기
    await page.waitForLoadState('networkidle')
    await expect(page.getByText('passport')).toBeVisible()
    
    // 마지막 카드까지 이동 (19번 다음 클릭)
    const nextButton = page.getByRole('button', { name: '다음 →' })
    for (let i = 0; i < 19; i++) {
      await nextButton.click()
      // 다음 버튼이 다시 활성화될 때까지 대기 (마지막 카드 전까지)
      if (i < 18) {
        await page.waitForTimeout(50)
      }
    }
    
    // 진행률 "20 / 20" 확인
    await expect(page.getByText('20 / 20')).toBeVisible()
    
    // 마지막 카드 "currency" 확인
    await expect(page.getByText('currency')).toBeVisible()
    
    // "다음 →" 버튼 비활성화 확인
    await expect(nextButton).toBeDisabled()
    
    // "학습 완료" 버튼 표시 확인
    await expect(page.getByRole('button', { name: '학습 완료' })).toBeVisible()
  })

  test('네비게이션바에서 다른 페이지로 이동할 수 있다', async ({ page }) => {
    await page.goto('/')
    
    // 네비게이션 항목 확인
    await expect(page.getByRole('link', { name: '홈' })).toBeVisible()
    await expect(page.getByRole('link', { name: '학습' })).toBeVisible()
    await expect(page.getByRole('link', { name: '퀴즈' })).toBeVisible()
    await expect(page.getByRole('link', { name: '통계' })).toBeVisible()
    await expect(page.getByRole('link', { name: '설정' })).toBeVisible()
    
    // 통계 페이지로 이동
    await page.getByRole('link', { name: '통계' }).click()
    await expect(page).toHaveURL('/stats')
    await expect(page.getByRole('heading', { name: '통계' })).toBeVisible()
    
    // 설정 페이지로 이동
    await page.getByRole('link', { name: '설정' }).click()
    await expect(page).toHaveURL('/settings')
    await expect(page.getByRole('heading', { name: '설정' })).toBeVisible()
  })

  test('돌아가기 버튼으로 홈으로 돌아갈 수 있다', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: '학습 시작' }).click()
    
    // Study 페이지에서 돌아가기 클릭
    await page.getByRole('button', { name: '돌아가기' }).click()
    
    // 홈으로 돌아감 확인
    await expect(page).toHaveURL('/')
    await expect(page.getByRole('heading', { name: 'Flash Learn' })).toBeVisible()
  })
})

