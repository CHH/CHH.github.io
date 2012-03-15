module Jekyll
    class PostsByYearTag < Liquid::Block
        def initialize(tag_name, markup, tokens)
            super
        end

        def render(context)
            grouped_by_year = context["site"]["posts"].group_by do |post|
                post.date.year
            end

            result = ""

            context.stack do
                grouped_by_year.each_with_index do |posts, year|
                    context["year"] = year
                    super
                end
            end
        end
    end

    class PostsByMonth < Liquid::Block
        def initialize(tag_name, markup, tokens)
            super
            @year = markup
        end

        def render(context)
            "Hello World"
        end
    end
end

Liquid::Template.register_tag('posts_by_year', Jekyll::PostsByYearTag)
Liquid::Template.register_tag('posts_by_month', Jekyll::PostsByYearTag)
