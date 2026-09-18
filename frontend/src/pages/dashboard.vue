<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { fetchAuthors } from '../services/authors'
import { fetchBooks } from '../services/books'
import { fetchBorrowings, formatDate, getStatus } from '../services/borrowings'
import { fetchCategories } from '../services/categories'
import type { Book } from '../services/books'
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

const donutSegments = computed(() => {
  const circumference = 2 * Math.PI * 50
  let offset = 0

  return categoryBreakdown.value.map((category) => {
    const length = (category.percentage / 100) * circumference
    const segment = { length, offset, color: category.color }
    offset -= length
    return segment
  })
})

const recentBorrowings = computed(() =>
  borrowings.value
    .slice()
    .sort((a, b) => activityDate(b).localeCompare(activityDate(a)))
    .slice(0, 5)
)

const recentActivity = computed(() =>
  recentBorrowings.value.map((borrowing, index) => ({
    ...borrowing,
    event: borrowing.returnDate ? 'Returned by' : 'Borrowed by',
    eventDate: borrowing.returnDate ?? borrowing.borrowDate,
    accent: bookCoverColors[index % bookCoverColors.length]
  }))
)

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
  const max = Math.max(...days.map((day) => day.count), 1)
  const points = days.map((day, index) => ({
    ...day,
    x: 18 + index * 96,
    y: 132 - (day.count / max) * 94
  }))
  const line = points.map((point) => `${point.x},${point.y}`).join(' ')

  return {
    days: points,
    line,
    area: `${line} 594,142 18,142`,
    total: days.reduce((total, day) => total + day.count, 0)
  }
})

const bookCoverColors = [
  'from-[#122c54] to-[#2c5e9e]',
  'from-[#4c293d] to-[#9f4d4c]',
  'from-[#1f5e57] to-[#62a18f]',
  'from-[#7c5317] to-[#d58d22]',
  'from-[#4d3d83] to-[#8575b9]'
]

function activityDate(borrowing: Borrowing) {
  return borrowing.returnDate ?? borrowing.borrowDate
}

function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function bookInitials(title: string) {
  return title
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 3)
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
  <div class="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto pb-8 lg:gap-7">
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
      <article class="rounded-2xl border border-[#e4ebf3] bg-white p-5 shadow-[0_8px_24px_rgba(27,59,102,0.04)] xl:col-span-6">
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

        <div class="mt-6 h-52">
          <svg class="size-full overflow-visible" viewBox="0 0 612 174" preserveAspectRatio="none" role="img" aria-label="Weekly library activity chart">
            <defs>
              <linearGradient id="activity-area" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stop-color="#2b65ad" stop-opacity="0.18" />
                <stop offset="100%" stop-color="#2b65ad" stop-opacity="0.015" />
              </linearGradient>
            </defs>
            <line v-for="y in [26, 58, 90, 122, 142]" :key="y" x1="18" x2="594" :y1="y" :y2="y" stroke="#e8eef6" stroke-width="1" />
            <polygon :points="activityChart.area" fill="url(#activity-area)" />
            <polyline :points="activityChart.line" fill="none" stroke="#173b70" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />
            <g v-for="point in activityChart.days" :key="point.label">
              <circle :cx="point.x" :cy="point.y" r="5" fill="#ffffff" stroke="#173b70" stroke-width="2.5">
                <title>{{ point.label }}: {{ point.count }} loans</title>
              </circle>
            </g>
          </svg>
          <div class="mt-2 grid grid-cols-7 text-center text-[11px] font-medium text-[#7a8ba3]">
            <span v-for="day in activityChart.days" :key="day.label">{{ day.label }}</span>
          </div>
        </div>
      </article>

      <article class="rounded-2xl border border-[#e4ebf3] bg-white p-5 shadow-[0_8px_24px_rgba(27,59,102,0.04)] xl:col-span-6">
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

        <div class="mt-4 flex flex-col items-center gap-5 sm:flex-row sm:justify-around">
          <div class="relative flex size-48 shrink-0 items-center justify-center">
            <svg class="-rotate-90 size-full" viewBox="0 0 140 140" aria-label="Books by category chart" role="img">
              <circle cx="70" cy="70" r="50" fill="none" stroke="#edf1f6" stroke-width="18" />
              <circle
                v-for="(segment, index) in donutSegments"
                :key="index"
                cx="70"
                cy="70"
                r="50"
                fill="none"
                :stroke="segment.color"
                stroke-linecap="butt"
                stroke-width="18"
                :stroke-dasharray="`${segment.length} 314.16`"
                :stroke-dashoffset="segment.offset"
              />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span class="font-serif text-3xl font-bold leading-none tracking-[-0.04em] text-[#132f57]">{{ totalBooks }}</span>
              <span class="mt-1 text-xs text-[#7486a0]">Total books</span>
            </div>
          </div>

          <div class="w-full max-w-[250px] divide-y divide-[#edf1f6]">
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
      <article class="rounded-2xl border border-[#e4ebf3] bg-white shadow-[0_8px_24px_rgba(27,59,102,0.04)] xl:col-span-6">
        <div class="flex items-center justify-between px-5 pb-3 pt-5">
          <div>
            <h2 class="font-serif text-lg font-bold text-[#132f57]">Recent activity</h2>
            <p class="mt-0.5 text-xs text-[#7486a0]">The latest circulation updates</p>
          </div>
          <RouterLink to="/borrowings" class="flex items-center gap-1 text-xs font-semibold text-[#173b70] transition-colors hover:text-[#2b65ad]">
            View all activity
            <UIcon name="i-lucide-chevron-right" class="size-3.5" />
          </RouterLink>
        </div>

        <div class="divide-y divide-[#edf1f6] px-5">
          <div v-for="item in recentActivity" :key="item.id" class="grid grid-cols-[2.15rem_minmax(0,1fr)] gap-x-3 py-3.5 sm:grid-cols-[2.15rem_minmax(0,1.4fr)_minmax(0,1fr)_auto] sm:items-center">
            <div class="flex h-12 w-9 items-center justify-center rounded-md bg-gradient-to-br p-1 text-center text-[8px] font-bold leading-tight text-white shadow-sm" :class="item.accent">
              {{ bookInitials(item.book.title) }}
            </div>
            <div class="min-w-0">
              <p class="truncate text-sm font-semibold text-[#263f5f]">{{ item.book.title }}</p>
              <p class="mt-0.5 truncate text-xs text-[#7486a0]">{{ item.book.authors?.map((author) => author.name).join(', ') || 'Unknown author' }}</p>
            </div>
            <div class="mt-2 flex items-center gap-2 sm:mt-0">
              <div class="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#f1f5fb] text-[9px] font-bold text-[#36577f]">
                {{ personInitials(item.user.name) }}
              </div>
              <div class="min-w-0 text-xs leading-tight">
                <p class="text-[#667896]">{{ item.event }}</p>
                <p class="truncate font-medium text-[#304968]">{{ item.user.name }}</p>
              </div>
            </div>
            <p class="col-start-2 mt-2 text-xs text-[#7a8ba3] sm:col-start-auto sm:mt-0 sm:text-right">
              {{ formatDate(item.eventDate) }}
            </p>
          </div>
          <div v-if="!recentActivity.length" class="py-12 text-center text-sm text-[#7a8ba3]">Activity will appear here as books circulate.</div>
        </div>
      </article>

      <article class="rounded-2xl border border-[#e4ebf3] bg-white shadow-[0_8px_24px_rgba(27,59,102,0.04)] xl:col-span-6">
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

        <div v-if="overdueBorrowings.length" class="divide-y divide-[#edf1f6] px-5">
          <div v-for="(borrowing, index) in overdueBorrowings.slice(0, 5)" :key="borrowing.id" class="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 py-3">
            <div class="flex h-10 w-8 items-center justify-center rounded-md bg-gradient-to-br p-1 text-center text-[7px] font-bold leading-tight text-white shadow-sm" :class="bookCoverColors[index % bookCoverColors.length]">
              {{ bookInitials(borrowing.book.title) }}
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
