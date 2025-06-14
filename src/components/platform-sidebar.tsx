import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Category, Platform } from '@/lib/types';

interface PlatformSidebarProps {
  platforms: Platform[];
  categories: Category[];
  activePlatform: Platform|undefined;
  activeCategories: Category[];
  onPlatformChange: (platform: Platform) => void;
  onCategoryToggle: (category: Category) => void;
}

export default function PlatformSidebar({
  platforms,
  categories,
  activePlatform,
  activeCategories,
  onPlatformChange,
  onCategoryToggle,
}: PlatformSidebarProps) {
  return (
    <div className="lg:col-span-1 space-y-6">
      <Card className="bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg text-slate-900 dark:text-white">
            Platforms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {platforms.map((platform: Platform) => (
            <Button
              key={platform.id}
              variant={activePlatform?.id === platform.id ? 'default' : 'ghost'}
              className="w-full justify-start font-medium text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white group transition-all duration-300 hover:scale-105 hover:shadow-md"
              onClick={() => onPlatformChange(platform)}
            >
              <i
                className={`${platform.icon} mr-2 group-hover:animate-bounce group-hover:text-blue-500 transition-all duration-300`}
              ></i>
              {platform.name}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg text-slate-900 dark:text-white">
            Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={activeCategories.some(
                  (cat) => cat.originalId === category.originalId,
                )}
                onCheckedChange={() => onCategoryToggle(category)}
              />
              <label
                htmlFor={category.id}
                className="text-sm text-slate-700 dark:text-gray-300 cursor-pointer"
              >
                {category.name}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900 dark:text-blue-300 flex items-center gap-2">
            <i className="fas fa-lightbulb text-yellow-500"></i>
            Quick Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
            {activePlatform?.originalId === 'git' && (
              <div className="animate-fade-in">
                <p className="font-medium">💡 Git Workflow:</p>
                <p>
                  Start with{' '}
                  <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">
                    git status
                  </code>{' '}
                  to check changes
                </p>
              </div>
            )}
            {activePlatform?.originalId === 'docker' && (
              <div className="animate-fade-in">
                <p className="font-medium">🐳 Docker Tips:</p>
                <p>
                  Use{' '}
                  <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">
                    docker ps
                  </code>{' '}
                  to see running containers
                </p>
              </div>
            )}
            {activePlatform?.originalId === 'vim' && (
              <div className="animate-fade-in">
                <p className="font-medium">⌨️ Vim Basics:</p>
                <p>
                  Press{' '}
                  <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">
                    i
                  </code>{' '}
                  to start editing,{' '}
                  <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">
                    Esc
                  </code>{' '}
                  to exit
                </p>
              </div>
            )}
            {activePlatform?.originalId === 'phpstorm' && (
              <div className="animate-fade-in">
                <p className="font-medium">🚀 PHPStorm Pro:</p>
                <p>
                  Use{' '}
                  <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">
                    Ctrl+Shift+N
                  </code>{' '}
                  for quick file access
                </p>
              </div>
            )}
            {(activePlatform?.originalId === 'archlinux' ||
              activePlatform?.originalId === 'ubuntu') && (
              <div className="animate-fade-in">
                <p className="font-medium">🐧 Linux Power:</p>
                <p>
                  Combine commands with{' '}
                  <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">
                    &&
                  </code>{' '}
                  for efficiency
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
