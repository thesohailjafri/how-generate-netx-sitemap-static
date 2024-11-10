export default function Page() {
  return (
    <div className="">
      <h1>Blogs Page</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Exercitationem
        autem dolore architecto inventore enim tenetur minus nemo dolorem cum
        dicta!
      </p>
      <div className="ol">
        {[
          {
            title: 'How to be better backend dev',
            link: '/blogs/how-to-be-better-backend-dev',
          },
          {
            title: 'How to be better frontend dev',
            link: '/blogs/how-to-be-better-frontend-dev',
          },
          {
            title: 'How to be better dev',
            link: '/blogs/how-to-be-better-dev',
          },
        ].map((blog) => {
          return (
            <div className="li" key={blog.title}>
              <a href={blog.link}>{blog.title}</a>
            </div>
          )
        })}
      </div>
    </div>
  )
}
