import { computed, onMounted, ref } from 'vue'
import { fetchAuthors } from '../services/authors'
import { fetchBooks, type Book } from '../services/books'
import { fetchBorrowings, getStatus, type Borrowing, type BorrowingStatus } from '../services/borrowings'
import { fetchCategories, type Category } from '../services/categories'

export type ActivityKind = 'borrowed' | 'returned' | 'book-added' | 'book-deleted'

export interface ActivityItem {
  id: string
  kind: ActivityKind
  title: string
  subtitle: string
  actorInitials?: string
  actorLine1?: string
  actorLine2?: string
  date: string
}

export interface DashboardStat {
  label: string
  value: number
  detail: string
  icon: string
  iconClass: string
  dotClass: string
}

export interface CategorySlice {
  name: string
  count: number
  percentage: number
  color: string
}

export const ACTIVITY_KIND_STYLE: Record<ActivityKind, { icon: string, chip: string }> = {
  borrowed: { icon: 'i-lucide-book-down', chip: 'bg-[#edf4ff] text-[#2161bf]' },
  returned: { icon: 'i-lucide-book-up', chip: 'bg-[#eaf7f2] text-[#20876e]' },
  'book-added': { icon: 'i-lucide-book-plus', chip: 'bg-[#fff6e5] text-[#b76c00]' },
  'book-deleted': { icon: 'i-lucide-book-x', chip: 'bg-[#fff0ee] text-[#d84332]' }
}

export function activityKindLabel(kind: ActivityKind) {
  switch (kind) {
    case 'borrowed': return 'Loan'
    case 'returned': return 'Return'
    case 'book-added': return 'Added'
    case 'book-deleted': return 'Removed'
  }
}

export function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function personInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function overdueLabel(borrowing: Borrowing) {
  const dueDate = new Date(`${borrowing.dueDate}T12:00:00`)
  const difference = Math.max(1, Math.floor((Date.now() - dueDate.getTime()) / 86400000))
  return `${difference} day${difference === 1 ? '' : 's'} overdue`
}

export function statusClass(status: BorrowingStatus) {
  switch (status) {
    case 'Overdue':
      return 'bg-[#fff0ee] text-[#d84332]'
    case 'Due Today':
      return 'bg-[#fff6e5] text-[#b76c00]'
    case 'Returned':
      return 'bg-[#eaf7f2] text-[#16765f]'
    default:
      return 'bg-[#edf4ff] text-[#2161bf]'
  }
}

export function statusLabel(status: BorrowingStatus) {
  if (status === 'Borrowed') return 'On time'
  if (status === 'Due Today') return 'Due today'
  return status
}

/**
 * Data loading and every derived view for the dashboard route. Components
 * receive plain props, so no template recomputes metrics.
 */
export function useDashboard() {
  const books = ref<Book[]>([])
  const borrowings = ref<Borrowing[]>([])
  const categories = ref<Category[]>([])
  const authorCount = ref(0)

  onMounted(async () => {
    const [bookResults, borrowingResults, categoryResults, authorResults] = await Promise.all([
      fetchBooks(),
      fetchBorrowings(),
      fetchCategories(),
      fetchAuthors()
    ])

    books.value = bookResults
    borrowings.value = borrowingResults
    categories.value = categoryResults
    authorCount.value = authorResults.length
  })

  const totalBooks = computed(() => books.value.length)
  const availableCopies = computed(() =>
    books.value.reduce((total, book) => total + book.availableCopies, 0)
  )
  const activeBorrowings = computed(
    () => borrowings.value.filter((borrowing) => !borrowing.returnDate).length
  )
  const overdueBorrowings = computed(() =>
    borrowings.value
      .filter((borrowing) => getStatus(borrowing) === 'Overdue')
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
  )
  const overdueBooks = computed(() => overdueBorrowings.value.length)
  const availabilityRate = computed(() => {
    const circulationTotal = availableCopies.value + activeBorrowings.value
    return circulationTotal ? Math.round((availableCopies.value / circulationTotal) * 100) : 0
  })

  const dateLabel = computed(() =>
    new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date())
  )

  const greeting = computed(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  })

  const stats = computed<DashboardStat[]>(() => [
    {
      label: 'Total books',
      value: totalBooks.value,
      detail: 'Titles in catalog',
      icon: 'i-lucide-library-big',
      iconClass: 'bg-[#edf4ff] text-[#2161bf]',
      dotClass: 'bg-[#2161bf]'
    },
    {
      label: 'Available copies',
      value: availableCopies.value,
      detail: `${availabilityRate.value}% ready to borrow`,
      icon: 'i-lucide-book-check',
      iconClass: 'bg-[#eaf7f2] text-[#20876e]',
      dotClass: 'bg-[#20876e]'
    },
    {
      label: 'Active loans',
      value: activeBorrowings.value,
      detail: 'Currently checked out',
      icon: 'i-lucide-refresh-cw',
      iconClass: 'bg-[#fff6e5] text-[#d98b00]',
      dotClass: 'bg-[#d98b00]'
    },
    {
      label: 'Overdue loans',
      value: overdueBooks.value,
      detail: overdueBooks.value ? 'Need attention' : 'All caught up',
      icon: 'i-lucide-circle-alert',
      iconClass: 'bg-[#fff0ee] text-[#e34b38]',
      dotClass: 'bg-[#e34b38]'
    }
  ])

  const categoryBreakdown = computed<CategorySlice[]>(() => {
    const counts = new Map<string, number>()
    for (const book of books.value) {
      const name = book.category?.name ?? 'Other'
      counts.set(name, (counts.get(name) ?? 0) + 1)
    }

    const colors = ['#2b65ad', '#4d9b8b', '#e49b12', '#7661b9', '#ef7565', '#97a4b7']
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count], index) => ({
        name,
        count,
        percentage: totalBooks.value ? Math.round((count / totalBooks.value) * 100) : 0,
        color: colors[index % colors.length]
      }))
  })

  const recentActivity = computed<ActivityItem[]>(() => {
    const circulation: ActivityItem[] = borrowings.value.map((borrowing) => {
      const returned = Boolean(borrowing.returnDate)
      return {
        id: `borrowing-${borrowing.id}`,
        kind: returned ? 'returned' : 'borrowed',
        title: borrowing.bookResponse.title,
        subtitle:
          borrowing.bookResponse.authors.map((author) => author.name).join(', ') || 'Unknown author',
        actorInitials: personInitials(borrowing.userResponse.name),
        actorLine1: returned ? 'Returned by' : 'Borrowed by',
        actorLine2: borrowing.userResponse.name,
        date: borrowing.returnDate ?? borrowing.borrowDate
      }
    })

    const newest = books.value.slice(-2)
    const catalog: ActivityItem[] = [
      ...newest.map((book) => ({
        id: `book-added-${book.id}`,
        kind: 'book-added' as ActivityKind,
        title: book.title,
        subtitle: book.category?.name ?? 'New in catalog',
        actorLine1: 'Catalog update',
        actorLine2: 'Librarian',
        date: toDateKey(new Date())
      })),
      {
        id: 'book-deleted-sample',
        kind: 'book-deleted',
        title: 'Outdated Encyclopedia Vol. 4',
        subtitle: 'Removed from catalog',
        actorLine1: 'Catalog update',
        actorLine2: 'Librarian',
        date: toDateKey(new Date(Date.now() - 86400000))
      }
    ]

    return [...circulation, ...catalog]
      .sort((first, second) => second.date.localeCompare(first.date))
      .slice(0, 6)
  })

  const activityChart = computed(() => {
    const today = new Date()
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today)
      date.setDate(today.getDate() - (6 - index))
      const key = toDateKey(date)
      const count = borrowings.value.filter((borrowing) => borrowing.borrowDate === key).length

      return {
        label: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date),
        count
      }
    })

    return {
      labels: days.map((day) => day.label),
      counts: days.map((day) => day.count),
      total: days.reduce((total, day) => total + day.count, 0)
    }
  })

  const today = computed(() => toDateKey(new Date()))

  return {
    stats,
    categoryBreakdown,
    recentActivity,
    activityChart,
    overdueBorrowings,
    overdueBooks,
    totalBooks,
    authorCount,
    categoryCount: computed(() => categories.value.length),
    greeting,
    dateLabel,
    today
  }
}