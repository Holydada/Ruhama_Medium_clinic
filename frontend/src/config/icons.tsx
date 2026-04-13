/**
 * Professional Icon System
 * Centralized icon configuration using Lucide React
 * Replaces all emojis with professional, consistent icons
 */

import {
  // Medical & Healthcare
  Activity,
  Heart,
  Stethoscope,
  Pill,
  Syringe,
  TestTube,
  Microscope,
  Thermometer,
  Droplet,
  Zap,
  
  // User & People
  User,
  Users,
  UserPlus,
  UserCheck,
  UserX,
  UserCog,
  Shield,
  ShieldCheck,
  
  // Navigation & Actions
  Home,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  
  // Status & Alerts
  CheckCircle,
  XCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  
  // Documents & Files
  FileText,
  File,
  Files,
  FileCheck,
  FilePlus,
  FileEdit,
  Download,
  Upload,
  Printer,
  
  // Communication
  Mail,
  MessageSquare,
  Phone,
  Bell,
  BellOff,
  Send,
  
  // Time & Calendar
  Calendar,
  Clock,
  CalendarDays,
  CalendarCheck,
  CalendarX,
  Timer,
  
  // Medical Specific
  Ambulance,
  Bed,
  Clipboard,
  ClipboardCheck,
  ClipboardList,
  Briefcase,
  
  // Data & Analytics
  BarChart,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  Activity as Analytics,
  
  // Actions
  Plus,
  Minus,
  Edit,
  Trash2,
  Save,
  Search,
  Filter,
  RefreshCw,
  MoreVertical,
  MoreHorizontal,
  
  // Settings & Config
  Settings,
  Sliders,
  Tool,
  Wrench,
  Cog,
  
  // Location & Navigation
  MapPin,
  Navigation,
  Compass,
  
  // Money & Finance
  DollarSign,
  CreditCard,
  Wallet,
  Receipt,
  
  // Inventory & Stock
  Package,
  PackageCheck,
  PackagePlus,
  PackageMinus,
  Box,
  Archive,
  
  // Security
  Lock,
  Unlock,
  Key,
  Eye,
  EyeOff,
  
  // Media
  Image,
  Camera,
  Video,
  
  // Misc
  Star,
  Flag,
  Tag,
  Bookmark,
  Link,
  ExternalLink,
  Copy,
  Check,
  LogOut,
  LogIn,
} from 'lucide-react';

export const Icons = {
  // Medical & Healthcare
  medical: {
    activity: Activity,
    heart: Heart,
    stethoscope: Stethoscope,
    pill: Pill,
    syringe: Syringe,
    testTube: TestTube,
    microscope: Microscope,
    thermometer: Thermometer,
    droplet: Droplet,
    pulse: Zap,
    ambulance: Ambulance,
    bed: Bed,
  },
  
  // User & People
  user: {
    single: User,
    multiple: Users,
    add: UserPlus,
    check: UserCheck,
    remove: UserX,
    settings: UserCog,
    shield: Shield,
    verified: ShieldCheck,
  },
  
  // Navigation
  nav: {
    home: Home,
    menu: Menu,
    close: X,
    right: ChevronRight,
    left: ChevronLeft,
    down: ChevronDown,
    up: ChevronUp,
    arrowRight: ArrowRight,
    arrowLeft: ArrowLeft,
    arrowUp: ArrowUp,
    arrowDown: ArrowDown,
  },
  
  // Status & Alerts
  status: {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: AlertCircle,
    help: HelpCircle,
  },
  
  // Documents
  document: {
    file: FileText,
    generic: File,
    multiple: Files,
    checked: FileCheck,
    add: FilePlus,
    edit: FileEdit,
    download: Download,
    upload: Upload,
    print: Printer,
  },
  
  // Communication
  communication: {
    email: Mail,
    message: MessageSquare,
    phone: Phone,
    notification: Bell,
    notificationOff: BellOff,
    send: Send,
  },
  
  // Time & Calendar
  time: {
    calendar: Calendar,
    clock: Clock,
    calendarDays: CalendarDays,
    calendarCheck: CalendarCheck,
    calendarX: CalendarX,
    timer: Timer,
  },
  
  // Clipboard & Tasks
  clipboard: {
    default: Clipboard,
    check: ClipboardCheck,
    list: ClipboardList,
    briefcase: Briefcase,
  },
  
  // Charts & Analytics
  chart: {
    bar: BarChart,
    line: LineChart,
    pie: PieChart,
    trendUp: TrendingUp,
    trendDown: TrendingDown,
    analytics: Analytics,
  },
  
  // Actions
  action: {
    add: Plus,
    remove: Minus,
    edit: Edit,
    delete: Trash2,
    save: Save,
    search: Search,
    filter: Filter,
    refresh: RefreshCw,
    moreVertical: MoreVertical,
    moreHorizontal: MoreHorizontal,
  },
  
  // Settings
  settings: {
    default: Settings,
    sliders: Sliders,
    tool: Tool,
    wrench: Wrench,
    cog: Cog,
  },
  
  // Location
  location: {
    pin: MapPin,
    navigation: Navigation,
    compass: Compass,
  },
  
  // Finance
  finance: {
    dollar: DollarSign,
    card: CreditCard,
    wallet: Wallet,
    receipt: Receipt,
  },
  
  // Inventory
  inventory: {
    package: Package,
    packageCheck: PackageCheck,
    packagePlus: PackagePlus,
    packageMinus: PackageMinus,
    box: Box,
    archive: Archive,
  },
  
  // Security
  security: {
    lock: Lock,
    unlock: Unlock,
    key: Key,
    eye: Eye,
    eyeOff: EyeOff,
  },
  
  // Media
  media: {
    image: Image,
    camera: Camera,
    video: Video,
  },
  
  // Misc
  misc: {
    star: Star,
    flag: Flag,
    tag: Tag,
    bookmark: Bookmark,
    link: Link,
    externalLink: ExternalLink,
    copy: Copy,
    check: Check,
    logout: LogOut,
    login: LogIn,
  },
};

// Module-specific icon sets for easy access
export const ModuleIcons = {
  reception: {
    dashboard: Icons.nav.home,
    newPatient: Icons.user.add,
    repeatVisit: Icons.user.check,
    appointment: Icons.time.calendarCheck,
    doctorAssignment: Icons.user.settings,
    patientManagement: Icons.user.multiple,
  },
  
  doctor: {
    dashboard: Icons.medical.stethoscope,
    patientQueue: Icons.clipboard.list,
    patientChart: Icons.document.file,
    encounter: Icons.clipboard.check,
    prescription: Icons.medical.pill,
    labOrder: Icons.medical.testTube,
    injectionOrder: Icons.medical.syringe,
    ultrasoundOrder: Icons.medical.activity,
    orderManagement: Icons.clipboard.list,
    referral: Icons.document.file,
  },
  
  nurse: {
    dashboard: Icons.medical.heart,
    injectionQueue: Icons.medical.syringe,
    injectionAdmin: Icons.clipboard.check,
    vitalSigns: Icons.medical.activity,
    triageForm: Icons.clipboard.list,
    nursingNotes: Icons.document.edit,
    observationBoard: Icons.medical.bed,
  },
  
  emergency: {
    dashboard: Icons.medical.ambulance,
    quickRegistration: Icons.user.add,
    triage: Icons.clipboard.check,
    treatment: Icons.medical.stethoscope,
    disposition: Icons.document.checked,
    convertToFull: Icons.user.check,
  },
  
  laboratory: {
    dashboard: Icons.medical.microscope,
    pendingTests: Icons.time.timer,
    reportGeneration: Icons.document.file,
    verification: Icons.document.checked,
  },
  
  pharmacy: {
    dashboard: Icons.medical.pill,
    dispensing: Icons.clipboard.check,
    addDrug: Icons.action.add,
    inventory: Icons.inventory.package,
  },
  
  ultrasound: {
    dashboard: Icons.medical.activity,
    queue: Icons.clipboard.list,
    studyForm: Icons.document.edit,
    imageViewer: Icons.media.image,
  },
  
  finance: {
    dashboard: Icons.finance.dollar,
    billing: Icons.finance.receipt,
    payment: Icons.finance.card,
    invoice: Icons.document.file,
    dailyCloseout: Icons.chart.bar,
    monthlyReport: Icons.chart.line,
  },
  
  inventory: {
    dashboard: Icons.inventory.package,
    stockLevels: Icons.chart.bar,
    receiveDelivery: Icons.inventory.packagePlus,
    stockAdjustment: Icons.action.edit,
    stockMovement: Icons.nav.arrowRight,
    stockTransfer: Icons.action.refresh,
    storeRequest: Icons.document.add,
    purchaseInvoice: Icons.finance.receipt,
  },
  
  certificates: {
    list: Icons.document.multiple,
    medical: Icons.document.checked,
    sickLeave: Icons.document.file,
  },
  
  admin: {
    dashboard: Icons.settings.default,
    staffManagement: Icons.user.multiple,
    systemSettings: Icons.settings.cog,
    reports: Icons.chart.analytics,
    auditLog: Icons.clipboard.list,
    monitoring: Icons.medical.activity,
    dataExport: Icons.document.download,
    qualityAssurance: Icons.status.success,
  },
  
  patient: {
    medicalRecords: Icons.document.file,
    history: Icons.time.clock,
  },
  
  chat: {
    staffChat: Icons.communication.message,
  },
};

// Status icon mapping
export const StatusIcons = {
  PENDING: Icons.time.clock,
  IN_PROGRESS: Icons.medical.activity,
  COMPLETED: Icons.status.success,
  CANCELLED: Icons.status.error,
  VERIFIED: Icons.document.checked,
  DISPENSED: Icons.status.success,
  PAID: Icons.status.success,
  UNPAID: Icons.status.warning,
  PARTIAL: Icons.status.info,
};

// Priority icon mapping
export const PriorityIcons = {
  CRITICAL: Icons.status.error,
  HIGH: Icons.status.warning,
  MEDIUM: Icons.status.info,
  LOW: Icons.status.info,
  ROUTINE: Icons.status.info,
};

export default Icons;
