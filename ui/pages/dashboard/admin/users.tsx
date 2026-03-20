import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Plus, Trophy, UserCheck, UserX } from 'lucide-react';
import { useLoaderData } from 'react-router';
import { Button } from '~/components/ui/Button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '~/components/ui/sheet';
import { DashboardLayout } from '../DashboardLayout';
import type { Role } from '~/lib/roles';
import {
  ALL_ROLES,
  ROLE_LABELS,
  STAFF_ROLES,
  type UserRow,
  useAdminUsersController,
} from './useAdminUsersController';

export function AdminUsersPage() {
  const { role } = useLoaderData<{ role: Role }>();
  const {
    users,
    roleFilter,
    wantsMasterFilter,
    setRoleFilter,
    setWantsMasterFilter,
    sheetOpen,
    setSheetOpen,
    form,
    onSubmitCreate,
    isSubmitting,
    serverError,
  } = useAdminUsersController();

  return (
    <DashboardLayout role={role}>
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex items-center px-3 py-1 border border-aprosoja-mint rounded-full text-[10px] font-bold font-sans text-aprosoja-teal uppercase tracking-widest">
            Administrador
          </span>
          <h1 className="mt-3 font-heading-now text-[28px] sm:text-[32px] leading-tight text-aprosoja-teal">
            Usuários
          </h1>
          <p className="mt-1 text-[13px] font-sans text-aprosoja-teal/50">
            {users.length} usuário{users.length !== 1 ? 's' : ''} encontrado{users.length !== 1 ? 's' : ''}
          </p>
        </div>

        <Button
          onClick={() => setSheetOpen(true)}
          className="shrink-0 h-[38px] rounded-[30px] text-[11px] font-bold uppercase tracking-wide cursor-pointer"
        >
          <Plus size={14} />
          Adicionar
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        <FilterSelect
          value={roleFilter}
          onChange={setRoleFilter}
          options={ALL_ROLES as unknown as { value: string; label: string }[]}
        />
        <FilterSelect
          value={wantsMasterFilter}
          onChange={setWantsMasterFilter}
          options={[
            { value: '', label: 'Premio Master: todos' },
            { value: 'true', label: 'Quer Premio Master' },
            { value: 'false', label: 'Não quer Premio Master' },
          ]}
        />
      </div>

      {/* Tabela */}
      {users.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-[13px] font-sans text-aprosoja-teal/40">
          Nenhum usuário encontrado com esses filtros.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {users.map((user, i) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut', delay: i * 0.03 }}
            >
              <UserCard user={user} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Sheet: adicionar usuário */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-[420px] bg-white p-0 gap-0 border-l border-aprosoja-mint/30"
        >
          <SheetHeader className="px-6 pt-6 pb-5 border-b border-aprosoja-mint/20">
            <SheetTitle className="font-heading-now text-[20px] text-aprosoja-teal leading-tight">
              Adicionar usuário
            </SheetTitle>
            <p className="text-[12px] font-sans text-aprosoja-teal/50 mt-0.5">
              Cria a conta imediatamente sem necessidade de verificação de e-mail. O usuário pode redefinir a senha pelo fluxo de recuperação.
            </p>
          </SheetHeader>

          <div className="px-6 py-6 flex-1 overflow-y-auto">
            <Form {...form}>
              <form onSubmit={onSubmitCreate} className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-bold font-sans text-aprosoja-teal uppercase tracking-wide">
                        E-mail
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="jurado@exemplo.com.br"
                          className="h-[44px] rounded-[12px] border-[1.5px] border-aprosoja-mint bg-white text-[13px] text-aprosoja-teal placeholder:text-aprosoja-teal/30 focus-visible:border-aprosoja-teal focus-visible:ring-aprosoja-teal/10"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-bold font-sans text-aprosoja-teal uppercase tracking-wide">
                        Cargo
                      </FormLabel>
                      <FormControl>
                        <select
                          className="w-full h-[44px] rounded-[12px] border-[1.5px] border-aprosoja-mint bg-white px-3 text-[13px] text-aprosoja-teal focus:outline-none focus:border-aprosoja-teal"
                          {...field}
                        >
                          <option value="">Selecione um cargo</option>
                          {STAFF_ROLES.map((r) => (
                            <option key={r.value} value={r.value}>
                              {r.label}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />

                <AnimatePresence>
                  {serverError && (
                    <motion.p
                      key="error"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-[12px] font-sans text-destructive font-medium"
                    >
                      {serverError}
                    </motion.p>
                  )}
                </AnimatePresence>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 h-[44px] w-full rounded-[30px] text-[11px] font-bold uppercase tracking-wide cursor-pointer"
                >
                  {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                  {isSubmitting ? 'Criando...' : 'Criar usuário'}
                </Button>
              </form>
            </Form>
          </div>
        </SheetContent>
      </Sheet>
    </div>
    </DashboardLayout>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-[34px] rounded-[30px] border-[1.5px] border-aprosoja-mint bg-white px-3 pr-8 text-[12px] font-sans text-aprosoja-teal focus:outline-none focus:border-aprosoja-teal appearance-none"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23024240' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 10px center',
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function UserCard({ user }: { user: UserRow }) {
  const isCandidate = user.role === 'CANDIDATE';
  const emailConfirmed = user.candidate?.emailConfirmedAt != null;

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-aprosoja-mint/20 hover:border-aprosoja-mint/50 transition-colors">
      {/* Avatar inicial */}
      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-aprosoja-mint/20 text-aprosoja-teal font-bold text-[13px] font-sans shrink-0">
        {(user.candidate?.name ?? user.email).charAt(0).toUpperCase()}
      </div>

      {/* Info principal */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[13px] font-sans font-semibold text-aprosoja-teal truncate">
            {user.candidate?.name ?? '—'}
          </span>
          {isCandidate && (
            emailConfirmed
              ? <UserCheck size={13} className="text-aprosoja-mint shrink-0" strokeWidth={2} />
              : <UserX size={13} className="text-aprosoja-teal/30 shrink-0" strokeWidth={2} />
          )}
          {user.candidate?.wantsMaster && (
            <Trophy size={12} className="text-amber-500 shrink-0" strokeWidth={2} />
          )}
        </div>
        <span className="text-[11px] font-sans text-aprosoja-teal/50 truncate block">
          {user.email}
        </span>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
        {isCandidate && user.candidate && (
          <span className="inline-flex items-center h-[22px] px-2.5 rounded-full bg-aprosoja-mint/15 text-[10px] font-bold font-sans text-aprosoja-teal uppercase tracking-wide whitespace-nowrap">
            {user.candidate._count.works} obra{user.candidate._count.works !== 1 ? 's' : ''}
          </span>
        )}
        {isCandidate && user.candidate?.state && (
          <span className="inline-flex items-center h-[22px] px-2.5 rounded-full border border-aprosoja-mint/30 text-[10px] font-sans text-aprosoja-teal/60 whitespace-nowrap">
            {user.candidate.state}
          </span>
        )}
        <span className="inline-flex items-center h-[22px] px-2.5 rounded-full bg-aprosoja-teal text-[10px] font-bold font-sans text-white uppercase tracking-wide whitespace-nowrap">
          {ROLE_LABELS[user.role]}
        </span>
      </div>
    </div>
  );
}
