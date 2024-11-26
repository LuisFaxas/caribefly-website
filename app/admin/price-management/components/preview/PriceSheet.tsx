import { FC } from 'react'
import { Card } from '@/app/components/ui/card'
import { CharterData, DestinationData, PeriodData } from '@/types/charter'

interface PriceSheetProps {
  charter: CharterData
  selectedDestination: DestinationData
}

const PriceSheet: FC<PriceSheetProps> = ({ charter, selectedDestination }) => {
  return (
    <div className="w-full print:w-auto print:m-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 print:mb-4">
        <div className="flex items-center space-x-4">
          {charter.agencyLogo && (
            <img
              src={charter.agencyLogo}
              alt="Agency Logo"
              className="h-16 w-auto print:h-12"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold print:text-xl">{charter.name}</h1>
            <p className="text-gray-600 print:text-sm">
              {selectedDestination.destination}
            </p>
          </div>
        </div>
        <div className="text-right print:text-sm">
          <p>
            Last Updated: {new Date(charter.lastUpdated).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Pricing Table */}
      <Card className="p-6 print:p-4 print:shadow-none">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Period</th>
              <th className="text-right py-2">Round Trip</th>
              <th className="text-right py-2">One Way</th>
            </tr>
          </thead>
          <tbody>
            {selectedDestination.periods.map(
              (period: PeriodData, index: number) => (
                <tr key={index} className="border-b last:border-0">
                  <td className="py-3">{period.label}</td>
                  <td className="text-right py-3">${period.rt.toFixed(2)}</td>
                  <td className="text-right py-3">${period.ow.toFixed(2)}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </Card>

      {/* Flight Schedule */}
      <Card className="mt-6 p-6 print:p-4 print:shadow-none print:mt-4">
        <h2 className="text-xl font-semibold mb-4 print:text-lg">
          Flight Schedule
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {selectedDestination.flightTimes.map((time, index) => (
            <div key={index} className="flex justify-between print:text-sm">
              <span>Flight {index + 1}:</span>
              <span>
                {time.ida} - {time.regreso}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Additional Information */}
      {selectedDestination.additionalInfo && (
        <Card className="mt-6 p-6 print:p-4 print:shadow-none print:mt-4">
          <h2 className="text-xl font-semibold mb-4 print:text-lg">
            Additional Information
          </h2>
          <div
            className="prose print:text-sm"
            dangerouslySetInnerHTML={{
              __html: selectedDestination.additionalInfo,
            }}
          />
        </Card>
      )}

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white;
            color: black;
          }
          @page {
            margin: 2cm;
          }
        }
      `}</style>
    </div>
  )
}

export default PriceSheet
