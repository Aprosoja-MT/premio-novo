import { AnimatePresence, motion, type Transition } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '~/components/ui/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { useResetPasswordController } from './useResetPasswordController';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut', delay } as Transition,
});

export function ResetPasswordPage() {
  const { form, onSubmit, isSubmitting, serverError, email, showPassword, setShowPassword } =
    useResetPasswordController();

  return (
    <div className="min-h-screen flex">
      <LeftPanel />

      <main className="flex-1 flex items-center justify-center px-6 py-12 bg-[#F0F0ED]">
        <div className="w-full max-w-[400px]">
          <motion.div {...fadeUp(0)} className="mb-8 lg:hidden">
            <img src="/assets/LOGO_APROSOJA_VERDE.svg" alt="Aprosoja MT" className="h-[36px] w-auto" />
          </motion.div>

          <motion.a
            {...fadeUp(0)}
            href="/auth/forgot-password"
            className="inline-flex items-center gap-1.5 text-[12px] font-sans text-[#024240]/50 hover:text-[#024240] transition-colors mb-6"
          >
            <ArrowLeft size={13} strokeWidth={1.75} />
            Solicitar novo código
          </motion.a>

          <motion.div {...fadeUp(0.05)}>
            <span className="inline-flex items-center px-4 py-1.5 border-[1.5px] border-[#94d2b9] rounded-[30px] text-[10px] font-bold font-sans text-[#024240] uppercase tracking-wide whitespace-nowrap">
              NOVA SENHA
            </span>
          </motion.div>

          <motion.h1 {...fadeUp(0.1)} className="mt-4 font-heading-now text-[32px] leading-[1.1] text-[#024240]">
            Redefinir senha
          </motion.h1>

          <motion.p {...fadeUp(0.15)} className="mt-2 text-[13px] font-sans text-[#024240]/60">
            Insira o código enviado para{' '}
            <span className="font-semibold text-[#024240]">{email || 'seu e-mail'}</span> e escolha uma nova senha.
          </motion.p>

          <motion.div {...fadeUp(0.2)} className="mt-8">
            <Form {...form}>
              <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="confirmationCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-bold font-sans text-[#024240] uppercase tracking-wide">
                        Código de verificação
                      </FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="one-time-code"
                          placeholder="000000"
                          className="h-[46px] rounded-[12px] border-[1.5px] border-[#94d2b9] bg-white text-[13px] text-[#024240] placeholder:text-[#024240]/30 focus-visible:border-[#024240] focus-visible:ring-[#024240]/10 aria-invalid:border-destructive tracking-widest"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-bold font-sans text-[#024240] uppercase tracking-wide">
                        Nova senha
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            placeholder="••••••••"
                            className="h-[46px] rounded-[12px] border-[1.5px] border-[#94d2b9] bg-white pr-11 text-[13px] text-[#024240] placeholder:text-[#024240]/30 focus-visible:border-[#024240] focus-visible:ring-[#024240]/10 aria-invalid:border-destructive"
                            {...field}
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowPassword((p) => !p)}
                          aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#024240]/40 hover:text-[#024240] transition-colors"
                        >
                          {showPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                        </button>
                      </div>
                      <FormMessage className="text-[11px] font-sans" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-bold font-sans text-[#024240] uppercase tracking-wide">
                        Confirmar senha
                      </FormLabel>
                      <FormControl>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          placeholder="••••••••"
                          className="h-[46px] rounded-[12px] border-[1.5px] border-[#94d2b9] bg-white text-[13px] text-[#024240] placeholder:text-[#024240]/30 focus-visible:border-[#024240] focus-visible:ring-[#024240]/10 aria-invalid:border-destructive"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px] font-sans" />
                    </FormItem>
                  )}
                />

                <AnimatePresence>
                  {serverError && (
                    <motion.p
                      key="server-error"
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
                  size="lg"
                  disabled={isSubmitting}
                  className="mt-2 h-[46px] w-full rounded-[30px] text-[11px] font-bold uppercase tracking-wide cursor-pointer"
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  {isSubmitting ? 'SALVANDO...' : 'REDEFINIR SENHA'}
                </Button>
              </form>
            </Form>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function LeftPanel() {
  return (
    <aside className="hidden lg:flex flex-col justify-between w-[480px] xl:w-[520px] min-h-screen bg-[#024240] px-12 py-12 relative overflow-hidden">
      <div
        aria-hidden
        className="absolute -top-24 -right-24 w-[320px] h-[320px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(148,210,185,0.12) 0%, transparent 70%)' }}
      />
      <div
        aria-hidden
        className="absolute bottom-0 -left-16 w-[280px] h-[280px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(148,210,185,0.08) 0%, transparent 70%)' }}
      />

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10"
      >
        <img src="/assets/LOGO_APROSOJA_BRANCO.svg" alt="Aprosoja MT" className="h-[60px] w-auto block" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
        className="relative z-10 flex flex-col gap-4"
      >
        <img
          src="/assets/logo-premio-aprosoja.png"
          alt="Prêmio Aprosoja MT de Jornalismo"
          className="w-[200px] xl:w-[240px] h-auto"
          style={{ filter: 'brightness(0) invert(1) drop-shadow(0 2px 8px rgba(0,0,0,0.3))', opacity: 0.92 }}
        />
        <h2 className="font-heading-now text-[28px] xl:text-[32px] leading-[1.15] text-white">
          Quase lá,<br />nova senha
        </h2>
        <p className="text-[13px] font-sans text-white/50 leading-relaxed max-w-[280px]">
          Use o código recebido por e-mail para criar uma senha segura.
        </p>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.5 }}
        className="relative z-10 text-[11px] font-sans text-white/30"
      >
        © 2026 Aprosoja MT. Todos os direitos reservados.
      </motion.p>
    </aside>
  );
}
