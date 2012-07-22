
task :default do
    puts "Hello World\n"
end

task :foo do
    sh "ls -l"
end

namespace :post do
    desc "Creates an empty post"
    task :create, [:title] do |t, args|
        title = args.title.downcase.gsub(/\s+/, '-')
        post  = "_posts/#{Time.now.strftime('%Y-%m-%d')}-#{title}.markdown" 

        if File.exists? post
            puts %(File #{post} already exists!) if File.exists? post
            return
        end

        puts %(Creating Post "#{args.title}" => #{post})

        File.open(post, "w+") do |file|
            file.write(%{---
title: #{args.title}
layout: post
---
})
        end
    end
end
