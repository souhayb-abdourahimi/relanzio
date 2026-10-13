import {test,expect} from '@playwright/test';

test('mobile viewport renders usable Formules and Déconnexion commands',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('http://127.0.0.1:5173/mobile-fixture.html');
  const menu=page.getByRole('button',{name:'Ouvrir le menu'});
  await expect(menu).toBeVisible();
  await menu.click();
  await expect(page.getByRole('dialog',{name:'Menu de l’application'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Formules / Abonnement'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Déconnexion'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Tableau de bord'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Devis'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Support'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Paramètres'})).toBeVisible();

  await page.getByRole('button',{name:'Formules / Abonnement'}).click();
  await expect(page.locator('body')).toHaveAttribute('data-last-action','billing');
  await expect(page.getByRole('dialog',{name:'Menu de l’application'})).toHaveCount(0);

  await page.getByRole('button',{name:'Ouvrir le menu'}).click();
  await page.getByRole('button',{name:'Déconnexion'}).click();
  await expect(page.locator('body')).toHaveAttribute('data-last-action','logout');
  await expect(page.getByRole('dialog',{name:'Menu de l’application'})).toHaveCount(0);
});

test('desktop viewport keeps the mobile trigger hidden',async({page})=>{
  await page.setViewportSize({width:1024,height:768});
  await page.goto('http://127.0.0.1:5173/mobile-fixture.html');
  await expect(page.getByRole('button',{name:'Ouvrir le menu'})).toBeHidden();
});