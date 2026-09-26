import type { CSSProperties, SVGProps } from 'react';
import {
  Activity as ActivityIcon,
  Add,
  Airplane,
  ArrowDown2,
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
  Building,
  Buildings,
  Calendar as CalendarIcon,
  Category,
  Clock as ClockIcon,
  CloseCircle,
  Cloud as CloudIcon,
  CloudDrizzle,
  CloudSunny,
  Cpu as CpuIcon,
  DocumentDownload,
  DocumentText,
  DollarCircle,
  Edit2,
  ExportSquare,
  Eye as EyeIcon,
  EyeSlash,
  Global,
  Gps,
  HambergerMenu,
  Heart as HeartIcon,
  InfoCircle,
  Key as KeyIcon,
  LanguageSquare,
  Location,
  Lock as LockIcon,
  Logout,
  MagicStar,
  Map1,
  Message,
  Moon as MoonIcon,
  Notification,
  People,
  Refresh,
  Save2,
  SearchNormal1,
  Send2,
  Setting2,
  Share,
  ShieldTick,
  Sms,
  Star1,
  Sun1,
  SunFog,
  Tag as TagIcon,
  TickCircle,
  TickSquare,
  Trash,
  TrendUp,
  User as UserIcon,
  Warning2,
  Wind as WindIcon,
} from 'iconsax-react';
import type { Icon } from 'iconsax-react';

type IconWrapProps = {
  size?: number | string;
  color?: string;
  className?: string;
  style?: CSSProperties;
} & Omit<SVGProps<SVGSVGElement>, 'ref' | 'color' | 'strokeWidth'>;

function ix(IconComp: Icon) {
  function Wrapped({ size = 24, color, className, style }: IconWrapProps) {
    return (
      <IconComp
        size={size}
        color={color || 'currentColor'}
        variant="Linear"
        className={className}
        style={style}
      />
    );
  }
  return Wrapped;
}

export const Activity = ix(ActivityIcon);
export const Plane = ix(Airplane);
export const Calendar = ix(CalendarIcon);
export const User = ix(UserIcon);
export const Compass = ix(Gps);
export const Download = ix(DocumentDownload);
export const Plus = ix(Add);
export const Trash2 = ix(Trash);
export const Edit3 = ix(Edit2);
export const MapPin = ix(Location);
export const Star = ix(Star1);
export const AlertTriangle = ix(Warning2);
export const CloudRain = ix(CloudDrizzle);
export const Wind = ix(WindIcon);
export const Thermometer = ix(SunFog);
export const Check = ix(TickSquare);
export const X = ix(CloseCircle);
export const FileText = ix(DocumentText);
export const CheckCircle2 = ix(TickCircle);
export const RefreshCw = ix(Refresh);
export const Hotel = ix(Building);
export const Heart = ix(HeartIcon);
export const Send = ix(Send2);
export const Share2 = ix(Share);
export const Loader2 = ix(Refresh);
export const CloudSun = ix(CloudSunny);
export const Sun = ix(Sun1);
export const Cloud = ix(CloudIcon);
export const Key = ix(KeyIcon);
export const Sparkles = ix(MagicStar);
export const Globe = ix(Global);
export const Languages = ix(LanguageSquare);
export const DollarSign = ix(DollarCircle);
export const Clock = ix(ClockIcon);
export const Brain = ix(CpuIcon);
export const Users = ix(People);
export const Lock = ix(LockIcon);
export const MessageSquare = ix(Message);
export const Tag = ix(TagIcon);
export const Map = ix(Map1);
export const Settings = ix(Setting2);
export const Search = ix(SearchNormal1);
export const Moon = ix(MoonIcon);
export const Bell = ix(Notification);
export const Navigation = ix(Gps);
export const ChevronDown = ix(ArrowDown2);
export const Shield = ix(ShieldTick);
export const TrendingUp = ix(TrendUp);
export const Building2 = ix(Buildings);
export const LogOut = ix(Logout);
export const Menu = ix(HambergerMenu);
export const LayoutDashboard = ix(Category);
export const ArrowUpRight = ix(ExportSquare);
export const Bot = ix(CpuIcon);
export const CheckCircle = ix(TickCircle);
export const AlertCircle = ix(InfoCircle);
export const Mail = ix(Sms);
export const Eye = ix(EyeIcon);
export const EyeOff = ix(EyeSlash);
export const Save = ix(Save2);
export const ArrowRight = ix(ArrowRightIcon);
export const ArrowLeft = ix(ArrowLeftIcon);
export const Cpu = ix(CpuIcon);
