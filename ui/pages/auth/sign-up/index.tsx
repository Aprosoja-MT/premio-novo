import { AnimatePresence, motion, type Transition } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, Loader2, Upload } from 'lucide-react';
import { useRef } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { Button } from '~/components/ui/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { DatePicker } from '~/components/ui/date-picker';
import { maskPassport } from '~/lib/passport';
import { CATEGORIES, useSignUpController, type SignUpFormValues, type Step } from './useSignUpController';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut', delay } as Transition,
});

const STEP_LABELS: Record<Step, string> = {
  1: 'Dados pessoais',
  2: 'Categoria',
  3: 'Acesso',
};

const BRAZILIAN_STATES = [
  { value: 'AC', label: 'Acre' }, { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' }, { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' }, { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' }, { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' }, { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' }, { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' }, { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' }, { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' }, { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' }, { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' }, { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' }, { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' }, { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
];

const INPUT_CLASS = 'h-[46px] rounded-[12px] border-[1.5px] border-[#94d2b9] bg-white text-[13px] text-[#024240] placeholder:text-[#024240]/30 focus-visible:border-[#024240] focus-visible:ring-[#024240]/10 aria-invalid:border-destructive';
const SELECT_CLASS = 'h-[46px] rounded-[12px] border-[1.5px] border-[#94d2b9] bg-white text-[13px] text-[#024240] px-3 w-full outline-none focus:border-[#024240] appearance-none';
const LABEL_CLASS = 'text-[11px] font-bold font-sans text-[#024240] uppercase tracking-wide';

export function SignUpPage() {
  const ctrl = useSignUpController();
  const { form, step, nextStep, prevStep, onSubmit, isSubmitting, serverError, uploadError } = ctrl;

  return (
    <div className="min-h-screen flex">
      <LeftPanel />

      <main className="flex-1 flex items-center justify-center px-6 py-12 bg-[#F0F0ED]">
        <div className="w-full max-w-[460px]">
          <motion.div {...fadeUp(0)} className="mb-8 lg:hidden">
            <img src="/assets/logo-aprosoja.png" alt="Aprosoja MT" className="h-[36px] w-auto" />
          </motion.div>

          <motion.a {...fadeUp(0)} href="/auth/sign-in" className="inline-flex items-center gap-1.5 text-[12px] font-sans text-[#024240]/50 hover:text-[#024240] transition-colors mb-6">
            <ArrowLeft size={13} strokeWidth={1.75} />
            Já tenho conta
          </motion.a>

          <motion.div {...fadeUp(0.05)}>
            <span className="inline-flex items-center px-4 py-1.5 border-[1.5px] border-[#94d2b9] rounded-[30px] text-[10px] font-bold font-sans text-[#024240] uppercase tracking-wide whitespace-nowrap">
              CADASTRO DE CANDIDATO
            </span>
          </motion.div>

          <motion.h1 {...fadeUp(0.1)} className="mt-4 font-heading-now text-[32px] leading-[1.1] text-[#024240]">
            {STEP_LABELS[step]}
          </motion.h1>

          <motion.div {...fadeUp(0.12)} className="mt-3 flex items-center gap-2">
            {([1, 2, 3] as Step[]).map((s) => (
              <div
                key={s}
                className={`h-[3px] rounded-full transition-all duration-300 ${s <= step ? 'bg-[#024240]' : 'bg-[#94d2b9]/40'} ${s === step ? 'flex-[2]' : 'flex-1'}`}
              />
            ))}
          </motion.div>

          <motion.div {...fadeUp(0.15)} className="mt-6">
            <Form {...form}>
              <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <AnimatePresence mode="wait">
                  {step === 1 && <Step1 key="step1" form={form} />}
                  {step === 2 && <Step2 key="step2" ctrl={ctrl} />}
                  {step === 3 && <Step3 key="step3" form={form} showPassword={ctrl.showPassword} setShowPassword={ctrl.setShowPassword} />}
                </AnimatePresence>

                <AnimatePresence>
                  {(serverError || uploadError) && step === 3 && (
                    <motion.p
                      key="error"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-[12px] font-sans text-destructive font-medium"
                    >
                      {uploadError ?? serverError}
                    </motion.p>
                  )}
                </AnimatePresence>

                <div className="flex gap-3 mt-2">
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={prevStep}
                      className="h-[46px] rounded-[30px] border-[1.5px] border-[#94d2b9] text-[11px] font-bold uppercase tracking-wide text-[#024240]"
                    >
                      Voltar
                    </Button>
                  )}

                  {step < 3 ? (
                    <Button
                      type="button"
                      size="lg"
                      onClick={nextStep}
                      className="flex-1 h-[46px] rounded-[30px] text-[11px] font-bold uppercase tracking-wide cursor-pointer"
                    >
                      Próximo
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="flex-1 h-[46px] rounded-[30px] text-[11px] font-bold uppercase tracking-wide cursor-pointer"
                    >
                      {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                      {isSubmitting ? 'CADASTRANDO...' : 'CADASTRAR'}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function Step1({ form }: { form: UseFormReturn<SignUpFormValues> }) {
  return (
    <motion.div
      key="s1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-4"
    >
      <FormField control={form.control} name="name" render={({ field }) => (
        <FormItem>
          <FormLabel className={LABEL_CLASS}>Nome completo</FormLabel>
          <FormControl>
            <Input
              placeholder="Seu nome completo"
              className={INPUT_CLASS}
              {...field}
              onChange={(e) => field.onChange(e.target.value.replace(/[0-9]/g, ''))}
            />
          </FormControl>
          <FormMessage className="text-[11px]" />
        </FormItem>
      )} />

      <FormField control={form.control} name="socialName" render={({ field }) => (
        <FormItem>
          <FormLabel className={LABEL_CLASS}>Nome social <span className="text-[#024240]/40 normal-case font-normal">(opcional)</span></FormLabel>
          <FormControl><Input placeholder="Nome social" className={INPUT_CLASS} {...field} /></FormControl>
          <FormMessage className="text-[11px]" />
        </FormItem>
      )} />

      <FormField control={form.control} name="cpf" render={({ field }) => (
        <FormItem>
          <FormLabel className={LABEL_CLASS}>CPF</FormLabel>
          <FormControl>
            <Input
              placeholder="000.000.000-00"
              maxLength={14}
              className={INPUT_CLASS}
              {...field}
              value={field.value
                .replace(/\D/g, '')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})$/, '$1-$2')}
              onChange={(e) => field.onChange(e.target.value.replace(/\D/g, '').slice(0, 11))}
            />
          </FormControl>
          <FormMessage className="text-[11px]" />
        </FormItem>
      )} />

      <FormField control={form.control} name="phone" render={({ field }) => (
        <FormItem>
          <FormLabel className={LABEL_CLASS}>Telefone</FormLabel>
          <FormControl>
            <Input
              type="tel"
              placeholder="(00) 00000-0000"
              maxLength={15}
              className={INPUT_CLASS}
              {...field}
              value={field.value
                .replace(/\D/g, '')
                .replace(/^(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{5})(\d{1,4})$/, '$1-$2')}
              onChange={(e) => field.onChange(e.target.value.replace(/\D/g, '').slice(0, 11))}
            />
          </FormControl>
          <FormMessage className="text-[11px]" />
        </FormItem>
      )} />

      <div className="grid grid-cols-2 gap-3">
        <FormField control={form.control} name="state" render={({ field }) => (
          <FormItem>
            <FormLabel className={LABEL_CLASS}>Estado</FormLabel>
            <FormControl>
              <select className={SELECT_CLASS} {...field}>
                <option value="">Selecione</option>
                {BRAZILIAN_STATES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </FormControl>
            <FormMessage className="text-[11px]" />
          </FormItem>
        )} />

        <FormField control={form.control} name="city" render={({ field }) => (
          <FormItem>
            <FormLabel className={LABEL_CLASS}>Cidade</FormLabel>
            <FormControl><Input placeholder="Sua cidade" className={INPUT_CLASS} {...field} /></FormControl>
            <FormMessage className="text-[11px]" />
          </FormItem>
        )} />
      </div>
    </motion.div>
  );
}

function Step2({ ctrl }: { ctrl: ReturnType<typeof useSignUpController> }) {
  const { form, category, drtFile, setDrtFile, enrollmentFile, setEnrollmentFile, drtError } = ctrl;
  const drtRef = useRef<HTMLInputElement>(null);
  const enrollmentRef = useRef<HTMLInputElement>(null);

  return (
    <motion.div
      key="s2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-4"
    >
      <FormField control={form.control} name="category" render={({ field }) => (
        <FormItem>
          <FormLabel className={LABEL_CLASS}>Categoria de inscrição</FormLabel>
          <FormControl>
            <select className={SELECT_CLASS} {...field}>
              <option value="">Selecione</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </FormControl>
          <FormMessage className="text-[11px]" />
        </FormItem>
      )} />

      {category && category !== 'UNIVERSITY' && (
        <div className="flex flex-col gap-1.5">
          <span className={LABEL_CLASS}>
            Registro DRT <span className="text-destructive">*</span>
          </span>
          <input
            type="file"
            ref={drtRef}
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => setDrtFile(e.target.files?.[0] ?? null)}
          />
          <button
            type="button"
            onClick={() => drtRef.current?.click()}
            className="flex items-center gap-2 w-full h-[46px] px-3 rounded-[12px] border-[1.5px] border-dashed border-[#94d2b9] bg-white text-[13px] text-[#024240]/60 hover:bg-[#94d2b9]/10 transition-colors"
          >
            <Upload size={14} strokeWidth={1.5} />
            {drtFile ? drtFile.name : 'Selecione o arquivo (PDF, JPG, PNG)'}
          </button>
          {drtError && <p className="text-[11px] font-medium text-destructive">{drtError}</p>}
        </div>
      )}

      {category === 'UNIVERSITY' && (
        <div className="flex flex-col gap-1.5">
          <span className={LABEL_CLASS}>Comprovante de matrícula ativa</span>
          <input
            type="file"
            ref={enrollmentRef}
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => setEnrollmentFile(e.target.files?.[0] ?? null)}
          />
          <button
            type="button"
            onClick={() => enrollmentRef.current?.click()}
            className="flex items-center gap-2 w-full h-[46px] px-3 rounded-[12px] border-[1.5px] border-dashed border-[#94d2b9] bg-white text-[13px] text-[#024240]/60 hover:bg-[#94d2b9]/10 transition-colors"
          >
            <Upload size={14} strokeWidth={1.5} />
            {enrollmentFile ? enrollmentFile.name : 'Selecione o arquivo (PDF, JPG, PNG)'}
          </button>
        </div>
      )}

      <FormField control={form.control} name="wantsMaster" render={({ field }) => (
        <FormItem>
          <label className="flex items-start gap-3 cursor-pointer p-3 rounded-[12px] border-[1.5px] border-[#94d2b9]/60 hover:bg-[#94d2b9]/10 transition-colors">
            <input
              type="checkbox"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-[#024240]"
            />
            <span className="text-[12px] font-sans text-[#024240]">
              Desejo concorrer ao <strong>Prêmio Master</strong> (sorteio paralelo — viagem internacional)
            </span>
          </label>
          <FormMessage className="text-[11px]" />
        </FormItem>
      )} />

      <AnimatePresence>
        {ctrl.wantsMaster && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col gap-4 p-4 rounded-[12px] border-[1.5px] border-[#94d2b9]/60 bg-[#94d2b9]/10"
          >
            <p className="text-[11px] font-bold font-sans text-[#024240] uppercase tracking-wide">Prêmio Master — Viagem Internacional</p>

            <FormField control={form.control} name="passport" render={({ field }) => (
              <FormItem>
                <FormLabel className={LABEL_CLASS}>Passaporte</FormLabel>
                <FormControl>
                  <Input
                    placeholder="AA000000"
                    maxLength={8}
                    className={INPUT_CLASS}
                    {...field}
                    value={maskPassport(field.value ?? '')}
                    onChange={(e) => field.onChange(maskPassport(e.target.value))}
                  />
                </FormControl>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )} />

            <FormField control={form.control} name="visaExpiry" render={({ field }) => (
              <FormItem>
                <FormLabel className={LABEL_CLASS}>Validade do visto</FormLabel>
                <FormControl>
                  <DatePicker
                    value={field.value as Date | undefined}
                    onChange={field.onChange}
                    placeholder="Selecione a validade"
                    disabled={(date) => date < new Date()}
                  />
                </FormControl>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Step3({
  form,
  showPassword,
  setShowPassword,
}: {
  form: UseFormReturn<SignUpFormValues>;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
}) {
  return (
    <motion.div
      key="s3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-4"
    >
      <FormField control={form.control} name="email" render={({ field }) => (
        <FormItem>
          <FormLabel className={LABEL_CLASS}>E-mail</FormLabel>
          <FormControl>
            <Input type="email" autoComplete="email" placeholder="seu@email.com.br" className={INPUT_CLASS} {...field} />
          </FormControl>
          <FormMessage className="text-[11px]" />
        </FormItem>
      )} />

      <FormField control={form.control} name="password" render={({ field }) => (
        <FormItem>
          <FormLabel className={LABEL_CLASS}>Senha</FormLabel>
          <div className="relative">
            <FormControl>
              <Input
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••"
                className={`${INPUT_CLASS} pr-11`}
                {...field}
              />
            </FormControl>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#024240]/40 hover:text-[#024240] transition-colors"
            >
              {showPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
            </button>
          </div>
          <FormMessage className="text-[11px]" />
        </FormItem>
      )} />

      <FormField control={form.control} name="confirmPassword" render={({ field }) => (
        <FormItem>
          <FormLabel className={LABEL_CLASS}>Confirmar senha</FormLabel>
          <FormControl>
            <Input
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="••••••••"
              className={INPUT_CLASS}
              {...field}
            />
          </FormControl>
          <FormMessage className="text-[11px]" />
        </FormItem>
      )} />
    </motion.div>
  );
}

function LeftPanel() {
  return (
    <aside className="hidden lg:flex flex-col justify-between w-[480px] xl:w-[520px] min-h-screen bg-[#024240] px-12 py-12 relative overflow-hidden">
      <div aria-hidden className="absolute -top-24 -right-24 w-[320px] h-[320px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(148,210,185,0.12) 0%, transparent 70%)' }} />
      <div aria-hidden className="absolute bottom-0 -left-16 w-[280px] h-[280px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(148,210,185,0.08) 0%, transparent 70%)' }} />

      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }} className="relative z-10">
        <img src="/assets/logo-aprosoja-branca.svg" alt="Aprosoja MT" className="h-[60px] w-auto block" />
      </motion.div>

      <div className="relative z-10 flex flex-col gap-8">
        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}>
          <img
            src="/assets/logo-premio-aprosoja.png"
            alt="Prêmio Aprosoja MT de Jornalismo"
            className="w-[200px] xl:w-[240px] h-auto"
            style={{ filter: 'brightness(0) invert(1) drop-shadow(0 2px 8px rgba(0,0,0,0.3))', opacity: 0.92 }}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: 'easeOut', delay: 0.25 }} className="flex flex-col gap-3">
          <span className="inline-flex items-center gap-2 h-[26px] w-fit px-3 border-[1.5px] border-[#94d2b9]/50 rounded-[30px] text-[10px] font-bold font-sans text-[#94d2b9] uppercase tracking-wide">
            EDIÇÃO 2026
          </span>
          <h2 className="font-heading-now text-[28px] xl:text-[32px] leading-[1.15] text-white">
            Inscreva-se<br />no prêmio
          </h2>
          <p className="text-[13px] font-sans text-white/50 leading-relaxed max-w-[280px]">
            Preencha seus dados para participar do Prêmio Aprosoja MT de Jornalismo 2026.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: 'easeOut', delay: 0.35 }} className="flex flex-col gap-2">
          {['5 categorias de jornalismo', 'Premiações em dinheiro e troféus', 'Aberto para todo o Brasil'].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <div className="w-1 h-1 rounded-full bg-[#94d2b9]" />
              <span className="text-[12px] font-sans text-white/60">{item}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, ease: 'easeOut', delay: 0.5 }} className="relative z-10 text-[11px] font-sans text-white/30">
        © 2026 Aprosoja MT. Todos os direitos reservados.
      </motion.p>
    </aside>
  );
}
