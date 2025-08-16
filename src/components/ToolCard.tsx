import Link from 'next/link';

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  icon?: string;
  isComingSoon?: boolean;
}

export default function ToolCard({ title, description, href, icon, isComingSoon = false }: ToolCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-lg hover:scale-105">
      <Link href={isComingSoon ? '#' : href} className={`block p-6 ${isComingSoon ? 'cursor-default' : ''}`}>
        <div className="flex items-start space-x-4">
          {icon && (
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">{icon}</span>
              </div>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-black group-hover:text-teal-600 transition-colors">
              {title}
            </h3>
            <p className="mt-2 text-sm text-black">{description}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-black">hiencode.com</span>
              <span className={`text-sm ${isComingSoon ? 'text-gray-400' : 'text-teal-600 group-hover:text-teal-700'} font-medium`}>
                {isComingSoon ? '開發中' : '進入 →'}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}