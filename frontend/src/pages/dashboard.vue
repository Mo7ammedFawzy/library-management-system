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
  <div class="dashboard-page workspace-page mx-auto flex w-full flex-col gap-4 pb-2">
    <section class="dashboard-hero" aria-labelledby="dashboard-greeting">
      <div class="dashboard-hero__copy">
        <p class="workspace-kicker">Library manager · Overview</p>
        <h1 id="dashboard-greeting" class="workspace-title">
          {{ greeting }}, Mohammad
        </h1>
        <p class="workspace-description">
          Here’s an overview of your library today — circulation, collection health, and what needs a nudge.
        </p>
      </div>

      <div class="dashboard-date">
        <span class="dashboard-date__icon">
          <UIcon name="i-lucide-calendar-days" class="size-4" aria-hidden="true" />
        </span>
        <span class="font-medium"><span class="sr-only">Today's date: </span><time :datetime="toDateKey(new Date())">{{ dateLabel }}</time></span>
      </div>
    </section>

    <section class="dashboard-metrics" aria-label="Library statistics">
      <article
        v-for="stat in dashboardStats"
        :key="stat.label"
        class="dashboard-metric"
      >
        <div class="flex items-start gap-3">
          <div class="metric-card__icon" :class="stat.iconClass">
            <UIcon :name="stat.icon" class="size-5" aria-hidden="true" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="metric-card__label">{{ stat.label }}</p>
            <p class="metric-card__value">
              {{ stat.value.toLocaleString() }}
            </p>
            <p class="metric-card__detail">
              <span class="size-1.5 shrink-0 rounded-full" :class="stat.dotClass" aria-hidden="true" />
              {{ stat.detail }}
            </p>
          </div>
        </div>
      </article>
    </section>

    <section class="dashboard-grid">
      <article class="dashboard-panel dashboard-panel--wide" aria-labelledby="activity-heading">
        <div class="data-panel__header">
          <div>
            <p class="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a99ae]">Circulation</p>
            <h2 id="activity-heading" class="mt-1 font-display text-lg font-bold leading-tight text-[#172f49]">Library activity</h2>
            <p class="mt-0.5 text-xs text-[#7486a0]">Loans created over the last seven days</p>
          </div>
          <div class="dashboard-summary">
            <p class="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#72849d]">This week</p>
            <p class="mt-0.5 font-display text-base font-bold leading-none text-[#244a6c]">{{ activityChart.total }} loans</p>
          </div>
        </div>

        <div class="dashboard-panel__body min-w-0" role="img" :aria-label="`Loans per day over the last seven days, ${activityChart.total} loans in total`">
          <ActivityChart :labels="activityChart.labels" :counts="activityChart.counts" aria-hidden="true" />
        </div>
      </article>

      <article class="dashboard-panel dashboard-panel--narrow" aria-labelledby="category-heading">
        <div class="data-panel__header">
          <div>
            <p class="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a99ae]">Collection</p>
            <h2 id="category-heading" class="mt-1 font-display text-lg font-bold leading-tight text-[#172f49]">Books by category</h2>
            <p class="mt-0.5 text-xs text-[#7486a0]">How your collection is distributed</p>
          </div>
          <RouterLink to="/categories" aria-label="View all categories" class="mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-[#244a6c] transition-colors hover:bg-[#edf4ff] hover:text-[#2b65ad] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8ca9ce]">
            View all
            <UIcon name="i-lucide-chevron-right" class="size-3.5" aria-hidden="true" />
          </RouterLink>
        </div>

        <div class="dashboard-panel__body dashboard-category__body grid min-w-0 grid-cols-1 items-center justify-items-center gap-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:justify-items-stretch">
          <CategoryDonutChart :items="donutSegments" :total="totalBooks" />

          <div class="w-full min-w-0 max-w-[250px] divide-y divide-[#edf1f6] sm:max-w-none">
            <div v-for="category in categoryBreakdown" :key="category.name" class="flex items-center justify-between gap-4 py-2.5 transition-colors first:pt-0 last:pb-0 hover:bg-[#f8fbff]">
              <span class="flex min-w-0 items-center gap-2.5 text-sm font-medium text-[#304968]">
                <span class="size-2.5 shrink-0 rounded-full ring-1 ring-inset ring-black/10" :style="{ backgroundColor: category.color }" aria-hidden="true" />
                <span class="truncate">{{ category.name }}</span>
              </span>
              <span class="shrink-0 rounded-md bg-[#f6f8fc] px-2 py-0.5 text-xs font-semibold text-[#304968]">
                {{ category.count }} <span class="font-normal text-[#7a8ba3]">{{ category.percentage }}%</span>
              </span>
            </div>
            <div v-if="!categoryBreakdown.length" class="py-8 text-center text-sm text-[#7a8ba3]">No categories yet</div>
          </div>
        </div>
      </article>
    </section>

    <section class="dashboard-grid">
      <article class="dashboard-panel dashboard-panel--wide flex flex-col" aria-labelledby="recent-heading">
        <div class="data-panel__header">
          <div>
            <p class="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a99ae]">Timeline</p>
            <h2 id="recent-heading" class="mt-1 font-display text-lg font-bold leading-tight text-[#172f49]">Recent activity</h2>
            <p class="mt-0.5 text-xs text-[#7486a0]">Catalog and circulation updates</p>
          </div>
          <RouterLink to="/borrowings" aria-label="View all borrowing activity" class="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-[#244a6c] transition-colors hover:bg-[#edf4ff] hover:text-[#2b65ad] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8ca9ce]">
            View all activity
            <UIcon name="i-lucide-chevron-right" class="size-3.5" aria-hidden="true" />
          </RouterLink>
        </div>

        <div class="dashboard-panel__body flex-1 divide-y divide-[#edf1f6]">
          <div v-for="item in recentActivity" :key="item.id" class="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 rounded-xl px-2 py-3 transition-colors hover:bg-[#f8fbff] sm:grid-cols-[2.5rem_minmax(0,1.4fr)_minmax(0,1fr)_auto] sm:items-center">
            <div class="flex size-10 items-center justify-center rounded-xl ring-1 ring-inset ring-black/[0.04]" :class="activityKindStyle[item.kind].chip" :title="activityKindLabel(item.kind)">
              <UIcon :name="activityKindStyle[item.kind].icon" class="size-5" aria-hidden="true" />
            </div>
            <div class="min-w-0">
              <p class="truncate text-sm font-semibold text-[#263f5f]">{{ item.title }}</p>
              <p class="mt-0.5 flex items-center gap-1.5 truncate text-xs text-[#7486a0]">
                <span class="inline-flex rounded-md bg-[#f1f5fb] px-1.5 py-0.5 text-[10px] font-semibold text-[#36577f]">{{ activityKindLabel(item.kind) }}</span>
                <span class="truncate">{{ item.subtitle }}</span>
              </p>
            </div>
            <div class="mt-2 flex items-center gap-2 sm:mt-0">
              <div v-if="item.actorInitials" aria-hidden="true" class="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#f1f5fb] text-[9px] font-bold text-[#36577f]">
                {{ item.actorInitials }}
              </div>
              <div v-else aria-hidden="true" class="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#f1f5fb] text-[#36577f]">
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

      <article class="dashboard-panel dashboard-panel--narrow flex flex-col" aria-labelledby="attention-heading">
        <div class="data-panel__header">
          <div>
            <p class="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a99ae]">Follow-up</p>
            <h2 id="attention-heading" class="mt-1 font-display text-lg font-bold leading-tight text-[#172f49]">Needs attention</h2>
            <p class="mt-0.5 text-xs text-[#7486a0]">Overdue loans that need a follow-up</p>
          </div>
          <RouterLink to="/borrowings" aria-label="View all overdue loans" class="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-[#244a6c] transition-colors hover:bg-[#edf4ff] hover:text-[#2b65ad] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8ca9ce]">
            View all overdue
            <UIcon name="i-lucide-chevron-right" class="size-3.5" aria-hidden="true" />
          </RouterLink>
        </div>

        <div v-if="overdueBorrowings.length" class="dashboard-alert" role="alert">
          <div class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#df4634] text-white shadow-[0_4px_12px_rgba(223,70,52,0.3)]">
            <UIcon name="i-lucide-circle-alert" class="size-4" aria-hidden="true" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="font-semibold text-[#9d3529]">{{ overdueBooks }} {{ overdueBooks === 1 ? 'loan needs' : 'loans need' }} attention</p>
            <p class="mt-0.5 truncate text-xs text-[#b3665c]">A gentle reminder can help keep the collection moving.</p>
          </div>
          <RouterLink to="/borrowings" aria-label="View overdue loans" class="hidden shrink-0 rounded-lg bg-[#9d3529] px-2.5 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#7f2b21] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8a09a] sm:inline-flex">
            View loans
          </RouterLink>
        </div>

        <div v-if="overdueBorrowings.length" class="dashboard-panel__body dashboard-overdue-list flex-1 divide-y divide-[#edf1f6]">
          <div v-for="borrowing in overdueBorrowings.slice(0, 5)" :key="borrowing.id" class="grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-[#fff8f7]">
            <div class="flex size-10 items-center justify-center rounded-xl bg-[#fff0ee] text-[#d84332] ring-1 ring-inset ring-[#f3d4cf]" title="Overdue">
              <UIcon name="i-lucide-calendar-clock" class="size-5" aria-hidden="true" />
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

        <div v-else class="dashboard-empty">
          <div class="flex size-11 items-center justify-center rounded-full bg-[#eaf7f2] text-[#20876e] ring-1 ring-inset ring-[#bfe6d8]">
            <UIcon name="i-lucide-circle-check-big" class="size-5" aria-hidden="true" />
          </div>
          <p class="mt-3 font-semibold text-[#2c5260]">Everything is on track</p>
          <p class="mt-1 max-w-56 text-sm text-[#7486a0]">There are no overdue books to follow up today.</p>
        </div>
      </article>
    </section>

    <footer class="dashboard-footer">
      <span class="inline-flex items-center gap-1.5">
        <span class="size-1.5 rounded-full bg-[#20876e]" aria-hidden="true" />
        {{ authorCount }} authors · {{ categories.length }} categories
      </span>
      <span class="hidden text-[#c7d1de] sm:inline" aria-hidden="true">·</span>
      <span>Athenaeum Library Management</span>
    </footer>
  </div>
</template>

<style scoped>
.dashboard-page {
  --dashboard-border: #dfe6ee;
  --dashboard-divider: #e9eef4;
  --dashboard-muted: #6b7d93;
  --dashboard-text: #1c3552;
  color: var(--dashboard-text);
}

.dashboard-hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 0.5rem 0.25rem 0.75rem;
}

.dashboard-hero__copy {
  min-width: 0;
}

.dashboard-page :deep(.workspace-kicker) {
  margin-bottom: 0.55rem;
  color: #64778f;
}

.dashboard-page :deep(.workspace-title) {
  font-size: clamp(1.65rem, 2.2vw, 2rem);
}

.dashboard-page :deep(.workspace-description) {
  max-width: 40rem;
  margin-top: 0.4rem;
}

.dashboard-date {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 0.65rem;
  border: 1px solid var(--dashboard-border);
  border-radius: 0.625rem;
  background: rgba(255, 255, 255, 0.72);
  padding: 0.55rem 0.75rem;
  color: #405772;
  font-size: 0.8125rem;
}

.dashboard-date__icon {
  display: flex;
  width: 1.75rem;
  height: 1.75rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.4rem;
  background: #eaf2fb;
  color: #315f8d;
}

.dashboard-metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  overflow: hidden;
  border: 1px solid var(--dashboard-border);
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.9);
}

.dashboard-metric {
  display: flex;
  min-width: 0;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.9rem 1rem;
  transition: background-color 160ms ease;
}

.dashboard-metric + .dashboard-metric {
  border-left: 1px solid var(--dashboard-divider);
}

.dashboard-metric:hover {
  background: #f9fbfd;
}

.dashboard-metric .metric-card__icon {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.55rem;
}

.dashboard-metric .metric-card__label {
  font-size: 0.65rem;
}

.dashboard-metric .metric-card__value {
  margin-top: 0.2rem;
  font-size: 1.4rem;
  font-variant-numeric: tabular-nums;
}

.dashboard-metric .metric-card__detail {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.35rem;
  color: var(--dashboard-muted);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 1rem;
}

.dashboard-panel {
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--dashboard-border);
  border-radius: 0.75rem;
  background: #fff;
}

.dashboard-panel--wide {
  grid-column: span 7;
}

.dashboard-panel--narrow {
  grid-column: span 5;
}

.dashboard-panel :deep(.data-panel__header) {
  min-height: 4.5rem;
  border-bottom-color: var(--dashboard-divider);
  background: transparent;
  padding: 0.85rem 1rem;
}

.dashboard-summary {
  flex-shrink: 0;
  border-left: 2px solid #b9cce0;
  padding: 0.15rem 0 0.15rem 0.65rem;
  text-align: right;
}

.dashboard-panel__body {
  padding: 0.9rem 1rem 1rem;
}

.dashboard-category__body {
  min-height: 15.5rem;
}

.dashboard-alert {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0.9rem 1rem 0.25rem;
  border: 1px solid #f0d2cd;
  border-radius: 0.625rem;
  background: #fff6f4;
  padding: 0.65rem 0.75rem;
  color: #6f3e37;
  font-size: 0.8125rem;
}

.dashboard-empty {
  display: flex;
  min-height: 15rem;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0.9rem 1rem 1rem;
  border: 1px dashed #d9e2ec;
  border-radius: 0.625rem;
  background: #fafcfe;
  padding: 1.5rem 1.25rem;
  text-align: center;
}

.dashboard-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  border-top: 1px solid var(--dashboard-divider);
  padding-top: 0.8rem;
  color: #7a8ba1;
  font-size: 0.7rem;
  text-align: center;
}

.dashboard-panel a {
  min-height: 2.25rem;
  touch-action: manipulation;
}

@media (min-width: 640px) {
  .dashboard-footer {
    flex-direction: row;
    justify-content: center;
    gap: 0.5rem;
  }

  .dashboard-alert {
    gap: 0.875rem;
    padding: 0.7rem 0.8rem;
  }
}

@media (max-width: 1023px) {
  .dashboard-panel--wide,
  .dashboard-panel--narrow {
    grid-column: 1 / -1;
  }
}

@media (max-width: 767px) {
  .dashboard-hero {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.9rem;
    padding-inline: 0;
  }

  .dashboard-date {
    width: 100%;
  }
}

@media (max-width: 639px) {
  .dashboard-metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .dashboard-metric {
    padding: 0.8rem;
  }

  .dashboard-metric + .dashboard-metric {
    border-left: 0;
  }

  .dashboard-metric:nth-child(even) {
    border-left: 1px solid var(--dashboard-divider);
  }

  .dashboard-metric:nth-child(n + 3) {
    border-top: 1px solid var(--dashboard-divider);
  }

  .dashboard-panel :deep(.data-panel__header) {
    align-items: flex-start;
    padding: 0.8rem;
  }

  .dashboard-panel__body {
    padding: 0.75rem 0.8rem 0.85rem;
  }

  .dashboard-category__body {
    min-height: auto;
  }

  .dashboard-panel a {
    min-height: 2.75rem;
  }

  .dashboard-alert,
  .dashboard-empty {
    margin-inline: 0.8rem;
  }
}

@media (max-width: 380px) {
  .dashboard-metrics {
    grid-template-columns: 1fr;
  }

  .dashboard-metric:nth-child(even) {
    border-left: 0;
  }

  .dashboard-metric:nth-child(n + 2) {
    border-top: 1px solid var(--dashboard-divider);
  }
}
</style>
