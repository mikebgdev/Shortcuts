import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Platform {
  id: string;
  name: string;
  icon: string;
}

interface Category {
  id: string;
  name: string;
}

interface PlatformSidebarProps {
  platforms: Platform[];
  categories: Category[];
  activePlatform: string;
  activeCategories: string[];
  onPlatformChange: (platformId: string) => void;
  onCategoryToggle: (categoryId: string) => void;
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
      {/* Platform Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Platforms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {platforms.map((platform) => (
            <Button
              key={platform.id}
              variant={activePlatform === platform.id ? "default" : "ghost"}
              className="w-full justify-start font-medium"
              onClick={() => onPlatformChange(platform.id)}
            >
              <i className={`${platform.icon} mr-2`}></i>
              {platform.name}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Categories Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={activeCategories.includes(category.id)}
                onCheckedChange={() => onCategoryToggle(category.id)}
              />
              <label
                htmlFor={category.id}
                className="text-sm text-slate-700 cursor-pointer"
              >
                {category.name}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
