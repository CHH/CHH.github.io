
include_recipe "apt"
include_recipe "build-essential"
include_recipe "git"
include_recipe "nodejs"

package "ruby" do
    action :upgrade
end

git "/tmp/npmjs" do
    repository "git://github.com/isaacs/npm.git"
    action :sync
    revision "v1.0.94"
    enable_submodules true
end

git "/tmp/npmjs/node_modules/lru-cache" do
    repository "git://github.com/isaacs/node-lru-cache.git"
    action :sync
end

execute "install_npm" do
    command "node cli.js install -g npm"
    user "root"
    cwd "/tmp/npmjs"
end

execute "install_lessjs" do
    command "npm install -g less"
    user "root"
end

execute "install_jekyll" do
    command "gem install jekyll"
    user "root"
end

bash "run_jekyll" do
    cwd node[:vagrant][:directory]
    code "jekyll --server 8080 --auto &"
end

