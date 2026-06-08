
import React from 'react'

interface NoDataRowProps {
    colSpan?: number
    message?: string
    description?: string
}

export default function NoDataRow({ 
    colSpan, 
    message = "No data available", 
    description 
}: NoDataRowProps) {
    const content = (
        <div className='py-12 px-6 flex flex-col justify-center items-center text-gray-500'>
            <svg className='w-12 h-12 mb-4 text-gray-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m0 0V9a2 2 0 012-2h2m0 0V6a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V9M16 13h-2m-2 0h-2m2 0V9a2 2 0 00-2-2H8v2m0 0v4m0-4h2m2 0h.01' />
            </svg>
            <p className='text-center font-medium mb-1'>{message}</p>
            {description && (
                <p className='text-center text-sm text-gray-400'>{description}</p>
            )}
        </div>
    )

    if (colSpan) {
        return (
            <tr>
                <td colSpan={colSpan} className='p-0'>
                    {content}
                </td>
            </tr>
        )
    }

    return content
}
