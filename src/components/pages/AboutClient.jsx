'use client'

import { useTranslation } from '@/i18n/client'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import SectionHeader from '@/components/ui/SectionHeader'

const activities = [
  { code: '6201', desc: 'Computer programming activities', primary: true },
  { code: '6311', desc: 'Data processing, hosting & related activities', primary: false },
  { code: '6312', desc: 'Web portals', primary: false },
  { code: '7410', desc: 'Specialised design activities', primary: false },
  { code: '7420', desc: 'Photographic activities', primary: false },
  { code: '9511', desc: 'Repair of computers and peripheral equipment', primary: false },
  { code: '6202', desc: 'Computer consultancy activities', primary: false },
  { code: '6203', desc: 'Computer facilities management activities', primary: false },
  { code: '6209', desc: 'Other IT & computer service activities', primary: false },
  { code: '5821', desc: 'Publishing of computer games', primary: false },
  { code: '5829', desc: 'Other software publishing', primary: false },
]

export default function AboutClient() {
  const { t } = useTranslation()
  return (
    <div className="space-y-12 sm:space-y-16">
      <SectionHeader title={t('about.title')} />

      <section>
        <SectionHeader title={t('about.sectionStory')} />
        <Card>
          <div className="space-y-4 max-w-3xl">
            <p className="font-mono text-sm sm:text-base leading-relaxed">{t('about.story1')}</p>
            <p className="font-mono text-sm sm:text-base leading-relaxed text-ink/70">{t('about.story2')}</p>
            <p className="font-mono text-sm sm:text-base leading-relaxed text-ink/70">{t('about.story3')}</p>
          </div>
        </Card>
      </section>

      <section>
        <SectionHeader title={t('about.sectionTeam')} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {['argjenta', 'rigon'].map((key) => (
            <Card key={key}>
              <div className="border-b-2 border-ink pb-3 mb-4">
                <h3 className="font-mono font-bold text-base sm:text-lg">{t(`about.team.${key}.name`)}</h3>
                <Badge yellow className="mt-1">{t(`about.team.${key}.role`)}</Badge>
              </div>
              <p className="font-mono text-sm text-ink/70 leading-relaxed mb-4">{t(`about.team.${key}.bio`)}</p>
              <p className="font-mono text-xs text-ink/50">{t(`about.team.${key}.location`)}</p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title={t('about.sectionBusiness')} />
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-sm border-collapse">
              <tbody>
                {[
                  [t('about.labelName'), 'Skriptura SH.P.K.'],
                  [t('about.labelTradeName'), 'Skriptura'],
                  [t('about.labelType'), t('about.valueType')],
                  [t('about.labelNUI'), <span key="nui" title="yes, we're legit" className="cursor-help underline decoration-dotted underline-offset-2">812112431</span>],
                  [t('about.labelEmployees'), '2'],
                  [t('about.labelRegistered'), '26/12/2023'],
                  [t('about.labelMunicipality'), 'Prishtinë'],
                  [t('about.labelAddress'), 'Rruga Dr. Shpëtim Robaj, B. C, Nr. 12'],
                  [t('about.labelCapital'), '100.00 €'],
                  [t('about.labelStatus'), <Badge key="s" yellow>{t('about.valueStatus')}</Badge>],
                ].map(([label, value], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-paper' : 'bg-ink/5'}>
                    <td className="py-2.5 pr-4 sm:pr-8 text-ink/60 whitespace-nowrap font-bold text-xs uppercase tracking-wide border-b border-ink/10 w-1/3">{label}</td>
                    <td className="py-2.5 text-ink border-b border-ink/10">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      <section>
        <SectionHeader title={t('about.sectionActivities')} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {activities.map((a) => (
            <div key={a.code} className={`border-2 border-ink p-3 flex gap-3 items-start ${a.primary ? 'bg-accent text-on-accent' : 'bg-paper text-ink'}`}>
              <span className="font-mono font-bold text-xs border border-current px-1.5 py-0.5 shrink-0">{a.code}</span>
              <div>
                <p className="font-mono text-xs leading-snug">{a.desc}</p>
                {a.primary && <p className="font-mono text-xs font-bold uppercase tracking-wide mt-1">{t('about.primaryActivity')}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
