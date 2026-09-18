<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { fetchAuthors } from '../services/authors'
import { fetchBooks } from '../services/books'
import { fetchBorrowings, formatDate, getStatus } from '../services/borrowings'
import { fetchCategories } from '../services/categories'
import ActivityChart from '../components/dashboard/ActivityChart.vue'
import CategoryDonutChart from '../components/dashboard/CategoryDonutChart.vue'
import type { Book } from '../services/books'
import type { Category } from '../services/categories'
import type { Borrowing, BorrowingStatus } from '../services/borrowings'

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
const activeBorrowings = computed(() =>
  borrowings.value.filter((borrowing) => !borrowing.returnDate).length
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

const dashboardStats = computed(() => [
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

const categoryBreakdown = computed(() => {
  const counts = new Map<string, number>()
  for (const book of books.value) {
    const name = book.category?.name ?? 'Other'
    counts.set(name, (counts.get(name) ?? 0) + 1)
  }

  const colors = ['#173b70', '#4d9b8b', '#e49b12', '#7661b9', '#ef7565', '#97a4b7']
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

const donutSegments = computed(() => categoryBreakdown.value)

type ActivityKind = 'borrowed' | 'returned' | 'book-added' | 'book-deleted'

interface ActivityItem {
  id: string
  kind: ActivityKind
  title: string
  subtitle: string
  actorInitials?: string
  actorLine1?: string
  actorLine2?: string
  date: string
}

const recentActivity = computed<ActivityItem[]>(() => {
  const circulation: ActivityItem[] = borrowings.value.map((borrowing) => {
    const returned = Boolean(borrowing.returnDate)
    return {
      id: `borrowing-${borrowing.id}`,
      kind: returned ? 'returned' : 'borrowed',
      title: borrowing.book.title,
      subtitle: borrowing.book.authors?.map((author) => author.name).join(', ') || 'Unknown author',
      actorInitials: personInitials(borrowing.user.name),
      actorLine1: returned ? 'Returned by' : 'Borrowed by',
      actorLine2: borrowing.user.name,
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
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6)
})

const activityKindStyle: Record<ActivityKind, { icon: string, chip: string }> = {
  borrowed: { icon: 'i-lucide-book-down', chip: 'bg-[#edf4ff] text-[#2161bf]' },
  returned: { icon: 'i-lucide-book-up', chip: 'bg-[#eaf7f2] text-[#20876e]' },
  'book-added': { icon: 'i-lucide-book-plus', chip: 'bg-[#fff6e5] text-[#b76c00]' },
  'book-deleted': { icon: 'i-lucide-book-x', chip: 'bg-[#fff0ee] text-[#d84332]' }
}

function activityKindLabel(kind: ActivityKind) {
  switch (kind) {
    case 'borrowed': return 'Loan'
    case 'returned': return 'Return'
    case 'book-added': return 'Added'
    case 'book-deleted': return 'Removed'
  }
}

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

function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function personInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function overdueLabel(borrowing: Borrowing) {
  const dueDate = new Date(`${borrowing.dueDate}T12:00:00`)
  const difference = Math.max(1, Math.floor((Date.now() - dueDate.getTime()) / 86400000))
  return `${difference} day${difference === 1 ? '' : 's'} overdue`
}

function statusClass(status: BorrowingStatus) {
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

function statusLabel(status: BorrowingStatus) {
  if (status === 'Borrowed') return 'On time'
  if (status === 'Due Today') return 'Due today'
  return status
}
</script>

<template>
  <div class="mx-auto flex w-full max-w-[1400px] flex-col gap-5 pb-2">
    <section class="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
      <div>
        <div class="mb-2 h-1 w-11 rounded-full bg-[#e5a214]" />
        <h1 class="font-serif text-3xl font-bold tracking-[-0.035em] text-[#132f57] sm:text-[2rem]">
          {{ greeting }}, Mohammad
        </h1>
        <p class="mt-1.5 text-sm text-[#667896]">
          Here’s an overview of your library today.
        </p>
      </div>

      <div class="flex items-center gap-3 self-start rounded-xl border border-[#e4ebf3] bg-white px-3.5 py-2.5 text-sm text-[#304968] shadow-[0_8px_24px_rgba(27,59,102,0.05)] lg:self-auto">
        <UIcon name="i-lucide-calendar-days" class="size-4 text-[#173b70]" />
        <span class="font-medium">{{ dateLabel }}</span>
      </div>
    </section>

    <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <article
        v-for="stat in dashboardStats"
        :key="stat.label"
        class="group rounded-2xl border border-[#e4ebf3] bg-white p-5 shadow-[0_8px_24px_rgba(27,59,102,0.045)] transition-colors hover:border-[#cdd9ea]"
      >
        <div class="flex items-center gap-4">
          <div class="flex size-14 shrink-0 items-center justify-center rounded-2xl" :class="stat.iconClass">
            <UIcon :name="stat.icon" class="size-6" />
          </div>
          <div class="min-w-0">
            <p class="font-serif text-[1.75rem] font-bold leading-none tracking-[-0.04em] text-[#132f57]">
              {{ stat.value.toLocaleString() }}
            </p>
            <p class="mt-1.5 text-sm font-semibold text-[#263f5f]">{{ stat.label }}</p>
            <p class="mt-1.5 flex items-center gap-1.5 text-xs text-[#7a8ba3]">
              <span class="size-1.5 rounded-full" :class="stat.dotClass" />
              {{ stat.detail }}
            </p>
          </div>
        </div>
      </article>
    </section>

    <section class="grid grid-cols-1 gap-5 xl:grid-cols-12">
      <article class="overflow-hidden rounded-2xl border border-[#e4ebf3] bg-white p-5 shadow-[0_8px_24px_rgba(27,59,102,0.04)] xl:col-span-6">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h2 class="font-serif text-lg font-bold text-[#132f57]">Library activity</h2>
            <p class="mt-0.5 text-xs text-[#7486a0]">Loans created over the last seven days</p>
          </div>
          <div class="rounded-lg bg-[#f1f5fb] px-3 py-1.5 text-right">
            <p class="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#72849d]">This week</p>
            <p class="mt-0.5 text-sm font-bold text-[#173b70]">{{ activityChart.total }} loans</p>
          </div>
        </div>

        <div class="mt-4 min-w-0">
          <ActivityChart :labels="activityChart.labels" :counts="activityChart.counts" />
        </div>
      </article>

      <article class="overflow-hidden rounded-2xl border border-[#e4ebf3] bg-white p-5 shadow-[0_8px_24px_rgba(27,59,102,0.04)] xl:col-span-6">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h2 class="font-serif text-lg font-bold text-[#132f57]">Books by category</h2>
            <p class="mt-0.5 text-xs text-[#7486a0]">How your collection is distributed</p>
          </div>
          <RouterLink to="/categories" class="flex items-center gap-1 text-xs font-semibold text-[#173b70] transition-colors hover:text-[#2b65ad]">
            View all
            <UIcon name="i-lucide-chevron-right" class="size-3.5" />
          </RouterLink>
        </div>

        <div class="mt-4 grid min-w-0 grid-cols-1 items-center justify-items-center gap-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:justify-items-stretch">
          <CategoryDonutChart :items="donutSegments" :total="totalBooks" />

          <div class="w-full min-w-0 max-w-[250px] divide-y divide-[#edf1f6] sm:max-w-none">
            <div v-for="category in categoryBreakdown" :key="category.name" class="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
              <span class="flex min-w-0 items-center gap-2.5 text-sm font-medium text-[#304968]">
                <span class="size-2.5 shrink-0 rounded-full" :style="{ backgroundColor: category.color }" />
                <span class="truncate">{{ category.name }}</span>
              </span>
              <span class="shrink-0 text-sm text-[#667896]">
                {{ category.count }} <span class="text-xs text-[#93a0b2]">({{ category.percentage }}%)</span>
              </span>
            </div>
            <div v-if="!categoryBreakdown.length" class="py-8 text-center text-sm text-[#7a8ba3]">No categories yet</div>
          </div>
        </div>
      </article>
    </section>

    <section class="grid grid-cols-1 gap-5 xl:grid-cols-12">
      <article class="flex flex-col overflow-hidden rounded-2xl border border-[#e4ebf3] bg-white shadow-[0_8px_24px_rgba(27,59,102,0.04)] xl:col-span-6">
        <div class="flex items-center justify-between px-5 pb-3 pt-5">
          <div>
            <h2 class="font-serif text-lg font-bold text-[#132f57]">Recent activity</h2>
            <p class="mt-0.5 text-xs text-[#7486a0]">Catalog and circulation updates</p>
          </div>
          <RouterLink to="/borrowings" class="flex items-center gap-1 text-xs font-semibold text-[#173b70] transition-colors hover:text-[#2b65ad]">
            View all activity
            <UIcon name="i-lucide-chevron-right" class="size-3.5" />
          </RouterLink>
        </div>

        <div class="flex-1 divide-y divide-[#edf1f6] px-5 pb-2">
          <div v-for="item in recentActivity" :key="item.id" class="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 py-3 sm:grid-cols-[2.5rem_minmax(0,1.4fr)_minmax(0,1fr)_auto] sm:items-center">
            <div class="flex size-10 items-center justify-center rounded-xl" :class="activityKindStyle[item.kind].chip" :title="activityKindLabel(item.kind)">
              <UIcon :name="activityKindStyle[item.kind].icon" class="size-5" />
            </div>
            <div class="min-w-0">
              <p class="truncate text-sm font-semibold text-[#263f5f]">{{ item.title }}</p>
              <p class="mt-0.5 flex items-center gap-1.5 truncate text-xs text-[#7486a0]">
                <span class="inline-flex rounded-md bg-[#f1f5fb] px-1.5 py-0.5 text-[10px] font-semibold text-[#36577f]">{{ activityKindLabel(item.kind) }}</span>
                <span class="truncate">{{ item.subtitle }}</span>
              </p>
            </div>
            <div class="mt-2 flex items-center gap-2 sm:mt-0">
              <div v-if="item.actorInitials" class="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#f1f5fb] text-[9px] font-bold text-[#36577f]">
                {{ item.actorInitials }}
              </div>
              <div v-else class="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#f1f5fb] text-[#36577f]">
                <UIcon name="i-lucide-library-big" class="size-3.5" />
              </div>
              <div class="min-w-0 text-xs leading-tight">
                <p class="text-[#667896]">{{ item.actorLine1 }}</p>
                <p class="truncate font-medium text-[#304968]">{{ item.actorLine2 }}</p>
              </div>
            </div>
            <p class="col-start-2 mt-2 text-xs text-[#7a8ba3] sm:col-start-auto sm:mt-0 sm:text-right">
              {{ formatDate(item.date) }}
            </p>
          </div>
          <div v-if="!recentActivity.length" class="py-12 text-center text-sm text-[#7a8ba3]">Activity will appear here as books circulate.</div>
        </div>
      </article>

      <article class="flex flex-col overflow-hidden rounded-2xl border border-[#e4ebf3] bg-white shadow-[0_8px_24px_rgba(27,59,102,0.04)] xl:col-span-6">
        <div class="flex items-center justify-between px-5 pb-3 pt-5">
          <div>
            <h2 class="font-serif text-lg font-bold text-[#132f57]">Needs attention</h2>
            <p class="mt-0.5 text-xs text-[#7486a0]">Overdue loans that need a follow-up</p>
          </div>
          <RouterLink to="/borrowings" class="flex items-center gap-1 text-xs font-semibold text-[#173b70] transition-colors hover:text-[#2b65ad]">
            View all overdue
            <UIcon name="i-lucide-chevron-right" class="size-3.5" />
          </RouterLink>
        </div>

        <div v-if="overdueBorrowings.length" class="mx-5 mb-2 flex items-center gap-3 rounded-xl bg-[#fff5f3] px-3.5 py-3 text-sm">
          <div class="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#ffe2dd] text-[#df4634]">
            <UIcon name="i-lucide-circle-alert" class="size-4" />
          </div>
          <div>
            <p class="font-semibold text-[#9d3529]">{{ overdueBooks }} {{ overdueBooks === 1 ? 'loan needs' : 'loans need' }} attention</p>
            <p class="mt-0.5 text-xs text-[#b3665c]">A gentle reminder can help keep the collection moving.</p>
          </div>
        </div>

        <div v-if="overdueBorrowings.length" class="flex-1 divide-y divide-[#edf1f6] px-5 pb-2">
          <div v-for="borrowing in overdueBorrowings.slice(0, 5)" :key="borrowing.id" class="grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 py-3">
            <div class="flex size-10 items-center justify-center rounded-xl bg-[#fff0ee] text-[#d84332]" title="Overdue">
              <UIcon name="i-lucide-calendar-clock" class="size-5" />
            </div>
            <div class="min-w-0">
              <p class="truncate text-sm font-semibold text-[#263f5f]">{{ borrowing.book.title }}</p>
              <p class="mt-0.5 truncate text-xs text-[#7486a0]">{{ borrowing.user.name }} · Due {{ formatDate(borrowing.dueDate) }}</p>
            </div>
            <div class="text-right">
              <p class="text-xs font-semibold text-[#df4634]">{{ overdueLabel(borrowing) }}</p>
              <span class="mt-1 inline-flex rounded-md px-2 py-0.5 text-[10px] font-semibold" :class="statusClass(getStatus(borrowing))">
                {{ statusLabel(getStatus(borrowing)) }}
              </span>
            </div>
          </div>
        </div>

        <div v-else class="mx-5 flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-[#dfe7f1] bg-[#fbfcfe] px-5 text-center">
          <div class="flex size-11 items-center justify-center rounded-full bg-[#eaf7f2] text-[#20876e]">
            <UIcon name="i-lucide-circle-check-big" class="size-5" />
          </div>
          <p class="mt-3 font-semibold text-[#2c5260]">Everything is on track</p>
          <p class="mt-1 text-sm text-[#7486a0]">There are no overdue books to follow up today.</p>
        </div>
      </article>
    </section>

    <footer class="pt-1 text-center text-xs text-[#8a99ae]">
      {{ authorCount }} authors · {{ categories.length }} categories · Athenaeum Library Management
    </footer>
  </div>
</template>
