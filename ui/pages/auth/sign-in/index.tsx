import { AnimatePresence, motion, type Transition } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
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
import { useSignInController } from './useSignInController';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut', delay } as Transition,
});

export function SignInPage() {
  const { form, onSubmit, showPassword, togglePassword, isSubmitting, serverError, resetSuccess, registeredSuccess, verifiedSuccess, verifiedInvalid } =
    useSignInController();

  return (
    <div className="min-h-screen flex">
      <LeftPanel />

      <main className="flex-1 flex items-center justify-center px-6 py-12 bg-[#F0F0ED]">
        <div className="w-full max-w-[400px]">
          <motion.div {...fadeUp(0)} className="mb-8 lg:hidden">
            <img
              src="/assets/LOGO_APROSOJA_VERDE.svg"
              alt="Aprosoja MT"
              className="h-[36px] w-auto"
            />
          </motion.div>

          <motion.div {...fadeUp(0.05)}>
            <span className="inline-flex items-center px-4 py-1.5 border-[1.5px] border-[#94d2b9] rounded-[30px] text-[10px] font-bold font-sans text-[#024240] uppercase tracking-wide whitespace-nowrap">
              ÁREA DO CANDIDATO
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.1)}
            className="mt-4 font-heading-now text-[32px] leading-[1.1] text-[#024240]"
          >
            Acesse sua conta
          </motion.h1>

          <motion.p {...fadeUp(0.15)} className="mt-2 text-[13px] font-sans text-[#024240]/60">
            Entre com suas credenciais para gerenciar sua inscrição.
          </motion.p>

          <AnimatePresence>
            {registeredSuccess && (
              <motion.p
                key="registered-success"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 text-[12px] font-sans text-[#024240] font-medium bg-[#94d2b9]/20 border border-[#94d2b9] rounded-[10px] px-4 py-3"
              >
                Cadastro realizado com sucesso! Faça login para continuar.
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {verifiedSuccess && (
              <motion.p
                key="verified-success"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 text-[12px] font-sans text-[#024240] font-medium bg-[#94d2b9]/20 border border-[#94d2b9] rounded-[10px] px-4 py-3"
              >
                E-mail confirmado com sucesso! Faça login para continuar.
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {verifiedInvalid && (
              <motion.p
                key="verified-invalid"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 text-[12px] font-sans text-destructive font-medium bg-destructive/5 border border-destructive/20 rounded-[10px] px-4 py-3"
              >
                Link de verificação inválido ou expirado.
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {resetSuccess && (
              <motion.p
                key="reset-success"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 text-[12px] font-sans text-[#024240] font-medium bg-[#94d2b9]/20 border border-[#94d2b9] rounded-[10px] px-4 py-3"
              >
                Senha redefinida com sucesso. Faça login com sua nova senha.
              </motion.p>
            )}
          </AnimatePresence>

          <motion.div {...fadeUp(0.2)} className="mt-8">
            <Form {...form}>
              <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-bold font-sans text-[#024240] uppercase tracking-wide">
                        E-mail
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          autoComplete="email"
                          placeholder="seu@email.com.br"
                          className="h-[46px] rounded-[12px] border-[1.5px] border-[#94d2b9] bg-white text-[13px] text-[#024240] placeholder:text-[#024240]/30 focus-visible:border-[#024240] focus-visible:ring-[#024240]/10 aria-invalid:border-destructive"
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
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-[11px] font-bold font-sans text-[#024240] uppercase tracking-wide">
                          Senha
                        </FormLabel>
                        <a
                          href="/auth/forgot-password"
                          className="text-[11px] font-sans text-[#024240]/50 hover:text-[#024240] transition-colors"
                        >
                          Esqueceu a senha?
                        </a>
                      </div>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            placeholder="••••••••"
                            className="h-[46px] rounded-[12px] border-[1.5px] border-[#94d2b9] bg-white pr-11 text-[13px] text-[#024240] placeholder:text-[#024240]/30 focus-visible:border-[#024240] focus-visible:ring-[#024240]/10 aria-invalid:border-destructive"
                            {...field}
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={togglePassword}
                          aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#024240]/40 hover:text-[#024240] transition-colors"
                        >
                          {showPassword
                            ? <EyeOff size={16} strokeWidth={1.5} />
                            : <Eye size={16} strokeWidth={1.5} />
                          }
                        </button>
                      </div>
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
                  {isSubmitting ? 'ENTRANDO...' : 'ENTRAR'}
                </Button>
              </form>
            </Form>
          </motion.div>

          <motion.p {...fadeUp(0.25)} className="mt-6 text-center text-[12px] font-sans text-[#024240]/50">
            Ainda não tem conta?{' '}
            <a
              href="/auth/sign-up"
              className="font-bold text-[#024240] hover:underline underline-offset-2 transition-all"
            >
              Cadastre-se
            </a>
          </motion.p>
        </div>
      </main>
    </div>
  );
}

function LeftPanel() {
  return (
    <aside className="hidden lg:flex flex-col justify-between w-[480px] xl:w-[520px] min-h-screen bg-[#024240] px-12 py-12 relative overflow-hidden items-start">
      <BackgroundOrbs />

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-[180px] xl:w-[210px] flex justify-center"
      >
        <img
          src="/assets/LOGO_APROSOJA_BRANCO.svg"
          alt="Aprosoja MT"
          className="h-[60px] w-auto block"
        />
      </motion.div>

      <div className="relative z-10 flex flex-col gap-6 w-[180px] xl:w-[210px]">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
        >
          <img
            src="/assets/LOGO_PREMIO_BRANCO.png"
            alt="Prêmio Aprosoja MT de Jornalismo"
            className="w-full h-auto"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.25 }}
          className="flex flex-col items-center gap-2"
        >
          <span className="inline-flex items-center gap-2 h-[26px] w-fit px-3 border-[1.5px] border-[#94d2b9]/50 rounded-[30px] text-[10px] font-bold font-sans text-[#94d2b9] uppercase tracking-wide">
            EDIÇÃO 2026
          </span>
          <h2 className="font-heading-now text-[28px] xl:text-[32px] leading-[1.15] text-white text-center">
            O agro sustentável<br />que transforma
          </h2>
          <p className="text-[13px] font-sans text-white/50 leading-relaxed max-w-[280px]">
            Reconhecendo o jornalismo que conecta o campo com o futuro.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.35 }}
          className="flex flex-col gap-2"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <div className="w-1 h-1 rounded-full bg-[#94d2b9]" />
              <span className="text-[12px] font-sans text-white/60">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.5 }}
        className="relative z-10 text-[11px] font-sans text-white/30 w-[180px] xl:w-[210px] text-center"
      >
        © 2026 Aprosoja MT. Todos os direitos reservados.
      </motion.p>
    </aside>
  );
}

function BackgroundOrbs() {
  return (
    <>
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
    </>
  );
}

const STATS = [
  { label: '6 categorias de jornalismo' },
  { label: 'Premiações em dinheiro e troféus' },
  { label: 'Aberto para todo o Brasil' },
];
