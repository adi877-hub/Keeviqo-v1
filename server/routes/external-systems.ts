import express from 'express';

const router = express.Router();

router.get('/:category', async (req, res) => {
  try {
    const { category } = req.params;
    
    let links: string[] = [];
    
    switch (category.toLowerCase()) {
      case 'health':
        links = [
          'https://www.health.gov.il/',
          'https://www.clalit.co.il/',
          'https://www.maccabi4u.co.il/',
          'https://www.meuhedet.co.il/',
          'https://www.leumit.co.il/'
        ];
        break;
      case 'government':
        links = [
          'https://www.gov.il/he',
          'https://www.misrad-hapnim.gov.il/',
          'https://www.btl.gov.il/',
          'https://www.gov.il/he/departments/ministry_of_justice',
          'https://www.gov.il/he/departments/ministry_of_finance'
        ];
        break;
      case 'education':
        links = [
          'https://edu.gov.il/',
          'https://www.campus.gov.il/',
          'https://www.universities-colleges.org.il/',
          'https://www.openu.ac.il/',
          'https://www.tau.ac.il/'
        ];
        break;
      case 'finance':
        links = [
          'https://www.bankisrael.org.il/',
          'https://www.taxes.gov.il/',
          'https://www.btl.gov.il/benefits/Pages/default.aspx',
          'https://www.gov.il/he/departments/israel_tax_authority',
          'https://www.gov.il/he/departments/ministry_of_finance'
        ];
        break;
      case 'transportation':
        links = [
          'https://www.gov.il/he/departments/ministry_of_transport',
          'https://www.rail.co.il/',
          'https://www.egged.co.il/',
          'https://www.dan.co.il/',
          'https://www.metropoline.com/'
        ];
        break;
      case 'legal':
        links = [
          'https://www.gov.il/he/departments/ministry_of_justice',
          'https://www.israelbar.org.il/',
          'https://www.court.gov.il/',
          'https://www.nevo.co.il/',
          'https://www.takdin.co.il/'
        ];
        break;
      default:
        links = [
          'https://www.gov.il/he',
          'https://www.btl.gov.il/',
          'https://www.health.gov.il/',
          'https://edu.gov.il/',
          'https://www.taxes.gov.il/'
        ];
    }
    
    res.json(links);
  } catch (error) {
    globalThis.console.error('Error fetching external system links:', error);
    res.status(500).json({ error: 'Failed to fetch external system links' });
  }
});

export default router;
