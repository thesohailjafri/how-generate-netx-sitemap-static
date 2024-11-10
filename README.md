## Approach 1: Using next-sitemap package

### Create a next-sitemap.config.js file in the root of your project and add the following code:

```javascript
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://example.com',
  generateRobotsTxt: true, // (optional)
  // ...other options
  changefreq: 'weekly',
  priority: 0.7,
  transform: async (config, path) => {
    let priority = config.priority // default priority => 0.5
    let changefreq = config.changefreq // default changefreq => 'weekly'

    // Set higher priority for home and team pages
    if (path === '/') {
      // home page
      priority = 1.0 // Highest priority for the homepage
      changefreq = 'monthly'
    } else if (path === '/blogs') {
      priority = 0.9 // Higher priority for the index blogs page
      changefreq = 'daily'
    } else if (path.includes('/blogs/')) {
      priority = 0.6 // Higher priority for the slug blogs page
      changefreq = 'daily'
    }

    return {
      loc: path, // => this will be exported as http(s)://<config.siteUrl>/<path>
      changefreq: changefreq,
      priority: priority, // Dynamic priority based on the page
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    }
  },
}
```

### Add the following script to your package.json file:

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "next-sitemap"
  }
}
```

## Approach 2: Using custom script

### Create a scripts/generate-sitemap.mjs file in the root of your project and add the following code:

```javascript
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
```

### Add the following script to your package.json file:

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "node ./scripts/generate-sitemap.mjs"
  }
}
```

### Run the following command to build your project and generate the sitemap:

```bash
npm run build
```

### The sitemap.xml file will be generated in the public folder of your project.

If you find this useful, please don't forget to star the [repository](https://github.com/thesohailjafri/how-generate-netx-sitemap-static) and share it with others. Thank you! 🚀

### Get In Touch

- [YouTube](https://www.youtube.com/@thesohailjafri)
- [Twitter](https://twitter.com/thesohailjafri)
- [LinkedIn](https://www.linkedin.com/in/thesohailjafri/)
- [Instagram](https://www.instagram.com/thesohailjafri/)
- [GitHub](https://github.com/thesohailjafri)
