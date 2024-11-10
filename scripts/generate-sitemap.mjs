import { writeFileSync } from 'fs'
import { globby } from 'globby'

const siteUrl = 'https://example.com'
const generateUrl = (path) => siteUrl + path
const defaultConfig = {
  changefreq: 'weekly',
  priority: '0.7',
  lastmod: new Date().toISOString(),
}

const homeConfig = {
  loc: '/',
  changefreq: 'monthly',
  priority: '1.0',
  lastmod: defaultConfig.lastmod,
}

const nextApproach = 'app' // app or pages
const serverPath = `.next/server/${nextApproach}`

async function generateSitemap() {
  // Grub Pages from build
  const buildPages = await globby([
    // grap only /*.html files and nested folders html files
    // *** Include ***
    `${serverPath}/*.html`,
    `${serverPath}/**/*.html`,
    // *** Exclude ***
    `!${serverPath}/index.html`,
    `!${serverPath}/404.html`,
    `!${serverPath}/_not-found.html`,
    `!${serverPath}/500.html`,
  ])

  const sitemapStr = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
			<url>
					<loc>${generateUrl(homeConfig.loc)}</loc>
					<lastmod>${homeConfig.lastmod}</lastmod>
					<changefreq>${homeConfig.changefreq}</changefreq>
					<priority>${homeConfig.priority}</priority>
			</url>
			${buildPages
        .map((page) => {
          const path = page.replace(serverPath, '').replace('.html', '')
          const loc = generateUrl(path)
          const lastmod = new Date().toISOString()
          let changefreq = defaultConfig.changefreq
          let priority = defaultConfig.priority
          if (path === '/') {
            // home page
            priority = '1.0' // Highest priority for the homepage
            changefreq = 'monthly'
          } else if (path === '/blogs') {
            priority = '0.9' // Higher priority for the index blogs page
            changefreq = 'daily'
          } else if (path.includes('/blogs/')) {
            priority = '0.6' // Higher priority for the slug blogs page
            changefreq = 'daily'
          }
          return `<url>
								<loc>${loc}</loc>
								<lastmod>${lastmod}</lastmod>
								<changefreq>${changefreq}</changefreq>
								<priority>${priority}</priority>
						</url>
					`
        })
        .join('')}
	</urlset>
	`

  writeFileSync(`public/sitemap.xml`, sitemapStr)
}

generateSitemap()
