/* eslint-disable react/display-name */
'use client'
import React from 'react'
import hotToast, { Toaster as HotToaster } from 'react-hot-toast';
import { Icons } from '../Icons';
import { cn } from '@/services/utils';

export const Toaster = HotToaster

interface CustomToastProps extends React.HTMLAttributes<HTMLDivElement> {
    visible: boolean;
}

export const CustomToast = ({ visible, className, ...props }: CustomToastProps) => {
    return (
        <div className={cn(
            'min-h-16 mb-2 flex w-[350px] flex-col items-start gap-1 rounded-md bg-white px-6 py-4 shadow-lg',
            visible && 'animate-in slide-in-from-buttom-5',
            className)}
            {...props}>
        </div>
    )
}

interface ToastIconProps extends Partial<React.SVGProps<SVGSVGElement>> {
    name: keyof typeof Icons
}

CustomToast.Icon = function ToastIcon({ name, className, ...props }: ToastIconProps) {
    const Icon = Icons[name]

    if (!Icon) {
        return null
    }

    return (
        <div className='flex h-20 w-20 items-center justify-center rounded-full bg-slate-100'>
            <Icon
                className={cn('h-10 w-10', className)}
            />
        </div>
    )
}

interface ToastTitleProps extends React.HTMLAttributes<HTMLHeadingElement> { }

CustomToast.Title = function ({ className, ...props }: ToastTitleProps) {
    return <p className={cn('text-sm font-medium', className)} {...props} />
}

interface ToastMessageProps extends React.HTMLAttributes<HTMLParagraphElement> { }

CustomToast.Message = function ({ className, ...props }: ToastMessageProps) {
    return <p className={cn('text-sm opacity-80', className)} {...props} />
}

interface ToastOpts {
    title?: string,
    message: string,
    type?: 'success' | 'error' | 'default',
    duration?: number,
}

export function toast(opts: ToastOpts) {
    const { title, message, type = 'default', duration = 3000 } = opts

    return hotToast.custom(
        ({ visible }) => (
            <CustomToast visible={visible} 
            className={
                cn({ 'bg-red-600 text-white': type === 'error', 'bg-black text-white': type === 'success' })
            }>
                <CustomToast.Title>{title}</CustomToast.Title>
                {message && <CustomToast.Message>{message}</CustomToast.Message>}
            </CustomToast>
        ),
        { duration }
    )
}