module Jekyll
  
  class LessCssFile < StaticFile
    def write(dest)
      # do nothing
    end
  end
  
  class LessJsGenerator < Generator
    safe true
    priority :low
    
    def generate(site)
      src_root = site.config['source']
      dest_root = site.config['destination']
      less_ext = /\.less$/i
      lessc_bin = site.config['lessc'] || 'lessc'
      
      # static_files have already been filtered against excludes, etc.
      site.static_files.each do |sf|
        next if not sf.path =~ less_ext
        
        site.static_files.delete(sf)

        next if site.config['exclude'].detect do |path|
            sf.path.gsub(src_root + "/", '').include? path
        end
      
        less_path = sf.path
        css_path = less_path.gsub(less_ext, '.css').gsub(src_root, dest_root)
        relative_dir = File.dirname(css_path).gsub(dest_root, '')
        file_name = File.basename(css_path)
        
        FileUtils.mkdir_p(File.dirname(css_path))
        
        begin
          command = [lessc_bin,
                     less_path,
                     css_path
                     ].join(' ')
          puts 'Compiling LESS: ' + command
          puts `#{command}`
          raise "LESS compilation error" if $?.to_i != 0
        end
        
        # Add this output file so it won't be "cleaned away"
        site.static_files << LessCssFile.new(site, site.source, relative_dir, file_name)
      end
    end
    
  end
end
