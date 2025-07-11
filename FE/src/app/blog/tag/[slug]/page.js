import BlogTwo from "@/components/blog/BlogTwo";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Section from "@/components/elements/Section";
import Footer from "@/components/footer/Footer";
import HeaderFive from "@/components/header/HeaderFive";
import NewsLetter from "@/components/newsletter/NewsLetter";
import ServiceTwo from "@/components/services/ServiceTwo";
import { slugify, unSlugify } from "@/utils";
import { getAllPosts } from "@/utils/api";

const BlogTags = ({ params }) => {
  const allPosts = getAllPosts([
    "id",
    "slug",
    "title",
    "cate",
    "featureImg",
    "tags",
  ]);

  const postsByTags = allPosts.filter((items) => {
    let tags = items.tags?.filter((tag) => slugify(tag) === params.slug);
    return tags.length > 0;
  });

  return (
    <>
      <HeaderFive headerSlider />
      <main className="main-wrapper">
        <Breadcrumb activeItem="Tags" title={unSlugify(params.slug)} />
        <Section>
          <div className="row g-5">
            {postsByTags.map((data) => (
              <div className="col-md-4" key={data.id}>
                <BlogTwo posts={data} />
              </div>
            ))}
          </div>
        </Section>
        <NewsLetter />
        <ServiceTwo />
      </main>
      <Footer />
    </>
  );
};

export default BlogTags;
