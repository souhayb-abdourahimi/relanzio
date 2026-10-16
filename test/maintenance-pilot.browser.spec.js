import { test, expect } from '@playwright/test';
for(const size of [{width:390,height:844},{width:412,height:915},{width:1280,height:800}]){
 test(`diagnostic flow ${size.width}`,async({page})=>{
 await page.setViewportSize(size);
 await page.route('**/api/maintenance-pilot/config',route=>route.fulfill({json:{visible:true,publicationApproved:true,identity:{name:'Atelier test',registration:'SIREN fictif',email:'test@example.invalid'}}}));
 let submissions=0;
 await page.route('**/api/maintenance-pilot/diagnostic',route=>{submissions++;const body=route.request().postDataJSON();expect(body.contract).toBe(120);expect(body.total).toBe(240);expect(body.client_email).toBeUndefined();return route.fulfill({status:201,json:{diagnostic:{contract_declared:120,pending_legal_validation:60,insufficient:20,excluded:40,sendable:0},message:'Demande enregistrée.'}})});
 await page.goto('/rappel-entretien');
 await expect(page.getByRole('heading',{level:1})).toContainText('chaudière');
 await page.getByLabel('Entreprise').fill('Atelier fictif');await page.getByLabel('Email professionnel').fill('artisan@example.invalid');
 for(const[label,v]of [['Total avec email','240'],['Sous contrat en cours','120'],['Hors contrat gaz ou fioul à examiner','60'],['Informations insuffisantes','20'],['Exclus','40']])await page.getByLabel(label,{exact:true}).fill(v);
 await page.getByRole('button',{name:'Demander mon diagnostic gratuit'}).click();
 await expect(page.getByRole('status')).toContainText('Demande enregistrée');
 await expect(page.getByText('120 sous contrat déclarés')).toBeVisible();expect(submissions).toBe(1);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:`test-results/pilot-${size.width}.png`,fullPage:true});
 });
}
test('error retains input and allows retry; no payment-return success claim',async({page})=>{
 await page.route('**/api/maintenance-pilot/config',r=>r.fulfill({json:{visible:true,publicationApproved:true,identity:{name:'Test',registration:'Test',email:'test@example.invalid'}}}));
 await page.goto('/rappel-entretien?payment=test-return');await expect(page.getByText('Le retour du paiement ne confirme pas son encaissement.')).toBeVisible();
 await page.getByLabel('Entreprise').fill('Fixture');await page.getByLabel('Email professionnel').fill('test@example.invalid');
 await page.route('**/api/maintenance-pilot/diagnostic',r=>r.fulfill({status:503,json:{error:'PILOT_STORAGE_UNAVAILABLE'}}));
 await page.getByRole('button',{name:'Demander mon diagnostic gratuit'}).click();await expect(page.getByRole('alert')).toContainText('Réessayez');await expect(page.getByLabel('Entreprise')).toHaveValue('Fixture');
});
