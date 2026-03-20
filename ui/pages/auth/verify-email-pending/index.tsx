import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { useLoaderData } from 'react-router';

export function VerifyEmailPendingPage() {
  const { email } = useLoaderData<{ email: string }>();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F0ED] px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-[400px] text-center"
      >
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#94d2b9]/20 border border-[#94d2b9] mx-auto mb-6">
          <Mail size={28} className="text-[#024240]" strokeWidth={1.5} />
        </div>

        <h1 className="font-heading-now text-[28px] leading-[1.1] text-[#024240] mb-3">
          Verifique seu e-mail
        </h1>

        <p className="text-[13px] font-sans text-[#024240]/60 leading-relaxed mb-2">
          Enviamos um link de confirmação para
        </p>
        {email && (
          <p className="text-[13px] font-sans font-semibold text-[#024240] mb-4">
            {email}
          </p>
        )}
        <p className="text-[13px] font-sans text-[#024240]/60 leading-relaxed">
          Clique no link do e-mail para ativar sua conta e acessar o sistema.
        </p>

        <div className="mt-8 pt-6 border-t border-[#024240]/10">
          <a
            href="/auth/sign-in"
            className="text-[12px] font-sans text-[#024240]/50 hover:text-[#024240] transition-colors"
          >
            Voltar para o login
          </a>
        </div>
      </motion.div>
    </div>
  );
}
