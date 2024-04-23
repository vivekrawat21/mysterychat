import { resend } from '@/lib/resend'
import VerificationEmail from '../../emails/VarificationEmail'
import { ApiResponse } from '@/types/ApiResponse'
import { Verification } from 'next/dist/lib/metadata/types/metadata-types';
export async function sendVerificationEmail(
    email: string, 
    username: string, 
    verifyCode: string): Promise<ApiResponse> {
        try {
            await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: email,
                subject: 'Mystry chat verification code',
                react: VerificationEmail({username, otp:verifyCode})
              });
            return{
                success:true, message: "Verification email sent successfully"
            }
        } catch (emailError) {
            console.error("Error sending verification email", emailError);
            return {
                success: false,
                message: "Error sending verification email",
            };
            
        }
}

