import FadeContent from '@/Components/ReactBits/Animations/FadeContent';
import Card from '@/Components/Generals/Card';
import Logo from '@/Components/Generals/Logo';
import FormField from '@/Components/Generals/FormField';
import Button from '@/Components/Generals/Button';
import { Mail, Lock } from 'lucide-react';

export default function AuthenticationCard({
    email,
    setEmail,
    password,
    setPassword,
    errors,
    onSubmit,
}) {
    return (
        <FadeContent blur={true} duration={2000} easing="ease-out" initialOpacity={0}>
            <Card className="w-full md:w-110 lg:w-150 3xl:w-300 [@media(min-width:2560px)]:w-[60rem] h-full bg-gradient-to-b from-black via-gray-900 to-gray-800 border-1 border-[#1382be9b] shadow-lg text-white flex flex-col items-center ">
                <Logo className='w-full md:w-60 lg:w-70 [@media(min-width:2560px)]:w-[rem]'/>

                <form className="w-full space-y-4" onSubmit={onSubmit}>
                    <FormField
                        label="E-MAIL"
                        iconClassName="text-[#1382be9b]"
                        icon={<Mail size={18} />}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={errors.email}
                    />
                    <FormField
                        label="SENHA"
                        iconClassName="text-[#1382be9b]"
                        icon={<Lock size={18} />}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={errors.password}
                    />

                    <Button type="submit" className='my-3'>
                        ACESSAR
                    </Button>
                </form>

                <div className="w-full flex justify-between mt-5 text-sm text-[#1383be]">
                    <a href="#" className="hover:underline">
                        Esqueci Minha Senha
                    </a>
                </div>
            </Card>
        </FadeContent>
    );
}
