
task :default do
    puts "Hello World\n"
end

namespace :post do
    desc "Creates an empty post"
    task :create, [:title] do |t, args|
        title = args.title.downcase.gsub(/\s+/, '-')

        post = "_posts/#{Time.now.strftime('%Y-%m-%d')}-#{title}.markdown" 

        puts %Q(Creating Post "#{args.title}" in #{post})

        File.open(post, "w+") do |file|
            file.write(%Q{---
title: #{args.title}
---
})
        end
    end
end
