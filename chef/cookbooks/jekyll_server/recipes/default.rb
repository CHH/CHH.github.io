
include_recipe "apt"
include_recipe "build-essential"
include_recipe "git"

package "ruby" do
    action :upgrade
end

execute "install_jekyll" do
    command "gem install jekyll"
    user "root"
end

bash "run_jekyll" do
    cwd node[:vagrant][:directory]
    code "jekyll --server 8080 --auto &"
end

