import { test, expect } from '@playwright/test';

test.describe('정오답 기록 기능', () => {
  test.beforeEach(async ({ page }) => {
    // localStorage 초기화
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('카드를 뒤집기 전에는 정오답 버튼이 비활성화 되어야 함', async ({ page }) => {
    // 여행 덱 선택하고 학습 시작
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.getByRole('button', { name: '학습 시작' }).click();

    // 정오답 버튼이 비활성화 되어 있는지 확인
    const correctButton = page.locator('button:has-text("맞았어")');
    const incorrectButton = page.locator('button:has-text("틀렸어")');

    await expect(correctButton).toBeDisabled();
    await expect(incorrectButton).toBeDisabled();

    // 안내 메시지 확인
    await expect(page.locator('text=카드를 뒤집은 후 정답을 선택해주세요')).toBeVisible();
  });

  test('카드를 뒤집은 후 정오답 버튼이 활성화 되어야 함', async ({ page }) => {
    // 여행 덱 선택하고 학습 시작
    await page.goto('/');
    await page.getByRole('button', { name: '학습 시작' }).click();

    // 카드 뒤집기
    await page.click('.perspective-1000');

    // 정오답 버튼이 활성화 되어 있는지 확인
    const correctButton = page.locator('button:has-text("맞았어")');
    const incorrectButton = page.locator('button:has-text("틀렸어")');

    await expect(correctButton).toBeEnabled();
    await expect(incorrectButton).toBeEnabled();
  });

  test('맞았어 버튼 클릭 시 다음 카드로 이동해야 함', async ({ page }) => {
    // 여행 덱 선택하고 학습 시작
    await page.goto('/');
    await page.getByRole('button', { name: '학습 시작' }).click();

    // 첫 번째 카드 확인
    await expect(page.locator('text=1 / 20')).toBeVisible();

    // 카드 뒤집기
    await page.click('.perspective-1000');

    // 맞았어 버튼 클릭
    await page.click('button:has-text("맞았어")');

    // 두 번째 카드로 이동 확인
    await expect(page.locator('text=2 / 20')).toBeVisible();

    // 카드가 앞면으로 되돌아갔는지 확인 (뒤집기 전 상태)
    const correctButton = page.locator('button:has-text("맞았어")');
    await expect(correctButton).toBeDisabled();
  });

  test('틀렸어 버튼 클릭 시 다음 카드로 이동해야 함', async ({ page }) => {
    // 여행 덱 선택하고 학습 시작
    await page.goto('/');
    await page.getByRole('button', { name: '학습 시작' }).click();

    // 첫 번째 카드 확인
    await expect(page.locator('text=1 / 20')).toBeVisible();

    // 카드 뒤집기
    await page.click('.perspective-1000');

    // 틀렸어 버튼 클릭
    await page.click('button:has-text("틀렸어")');

    // 두 번째 카드로 이동 확인
    await expect(page.locator('text=2 / 20')).toBeVisible();
  });

  test('Attempt가 localStorage에 저장되어야 함', async ({ page }) => {
    // 여행 덱 선택하고 학습 시작
    await page.goto('/');
    await page.getByRole('button', { name: '학습 시작' }).click();

    // 카드 뒤집기 및 맞았어 클릭
    await page.click('.perspective-1000');
    await page.click('button:has-text("맞았어")');

    // localStorage에 세션이 저장되었는지 확인
    const lastSession = await page.evaluate(() => {
      return localStorage.getItem('fc.lastSession');
    });

    expect(lastSession).not.toBeNull();
    const session = JSON.parse(lastSession!);
    
    expect(session.attempts).toHaveLength(1);
    expect(session.attempts[0].result).toBe('correct');
    expect(session.attempts[0].mode).toBe('study');
  });

  test('마지막 카드에서 세션 요약 다이얼로그가 표시되어야 함', async ({ page }) => {
    // 여행 덱 선택하고 학습 시작
    await page.goto('/');
    await page.getByRole('button', { name: '학습 시작' }).click();

    // 모든 카드를 빠르게 처리
    for (let i = 0; i < 20; i++) {
      // 카드 뒤집기
      await page.click('.perspective-1000');
      
      // 정답/오답 무작위 선택 (번갈아가며)
      if (i % 2 === 0) {
        await page.click('button:has-text("맞았어")');
      } else {
        await page.click('button:has-text("틀렸어")');
      }

      // 마지막 카드가 아니면 잠시 대기
      if (i < 19) {
        await page.waitForTimeout(100);
      }
    }

    // 세션 요약 다이얼로그 확인
    await expect(page.locator('text=학습 완료!')).toBeVisible();
    await expect(page.locator('text=총 카드 수')).toBeVisible();
    await expect(page.locator('text=맞은 개수')).toBeVisible();
    await expect(page.locator('text=틀린 개수')).toBeVisible();
    await expect(page.locator('text=정확도')).toBeVisible();
  });

  test('세션 요약에 정확한 통계가 표시되어야 함', async ({ page }) => {
    // 여행 덱 선택하고 학습 시작
    await page.goto('/');
    await page.getByRole('button', { name: '학습 시작' }).click();

    // 10개 맞추고 10개 틀리기
    for (let i = 0; i < 20; i++) {
      await page.click('.perspective-1000');
      
      if (i < 10) {
        await page.click('button:has-text("맞았어")');
      } else {
        await page.click('button:has-text("틀렸어")');
      }

      if (i < 19) {
        await page.waitForTimeout(100);
      }
    }

    // 통계 확인
    await expect(page.locator('text=학습 완료!')).toBeVisible();
    
    // 정확도 50% 확인
    await expect(page.locator('text=50%')).toBeVisible();
  });

  test('틀린 카드가 있으면 다시 학습 버튼이 표시되어야 함', async ({ page }) => {
    // 여행 덱 선택하고 학습 시작
    await page.goto('/');
    await page.getByRole('button', { name: '학습 시작' }).click();

    // 일부 카드를 틀리기
    for (let i = 0; i < 20; i++) {
      await page.click('.perspective-1000');
      
      if (i < 5) {
        await page.click('button:has-text("틀렸어")');
      } else {
        await page.click('button:has-text("맞았어")');
      }

      if (i < 19) {
        await page.waitForTimeout(100);
      }
    }

    // 틀린 카드 다시 학습 버튼 확인
    await expect(page.locator('text=틀린 카드 다시 학습 (5개)')).toBeVisible();
  });

  test('모두 맞으면 다시 학습 버튼이 표시되지 않아야 함', async ({ page }) => {
    // 여행 덱 선택하고 학습 시작
    await page.goto('/');
    await page.getByRole('button', { name: '학습 시작' }).click();

    // 모든 카드를 맞추기
    for (let i = 0; i < 20; i++) {
      await page.click('.perspective-1000');
      await page.click('button:has-text("맞았어")');

      if (i < 19) {
        await page.waitForTimeout(100);
      }
    }

    // 틀린 카드 다시 학습 버튼이 없어야 함
    await expect(page.locator('text=틀린 카드 다시 학습')).not.toBeVisible();
  });

  test('세션 요약에서 홈으로 돌아가기 버튼이 작동해야 함', async ({ page }) => {
    // 여행 덱 선택하고 학습 시작
    await page.goto('/');
    await page.getByRole('button', { name: '학습 시작' }).click();

    // 모든 카드를 빠르게 처리
    for (let i = 0; i < 20; i++) {
      await page.click('.perspective-1000');
      await page.click('button:has-text("맞았어")');
      if (i < 19) {
        await page.waitForTimeout(50);
      }
    }

    // 홈으로 돌아가기 버튼 클릭
    await page.getByRole('button', { name: '홈으로 돌아가기' }).click();

    // 홈 페이지로 이동 확인
    await expect(page.getByRole('heading', { name: 'Flash Learn' })).toBeVisible();
  });
});

