import { HandPalm, Play } from 'phosphor-react'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import * as zod from 'zod'
import { createContext , useState } from 'react'

import { 
  HomeCountainer, 
  StartCountDownButton, 
  StopCountDownButton,
} from './styles'

import { NewcycleForm } from './components/NewCycleForm'
import { CountDown } from './components/CountDown'
interface Cycle{
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptDate?: Date
  finishedDate?: Date
} 
interface CyclesContextType{
  activeCycle: Cycle | undefined  
  activeCycledID: string | null  
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds:number) => void
}

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo precisa ser de no mínimo 5 minutos')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos'),
})

type NewCycleFormData = zod.infer< typeof newCycleFormValidationSchema >

export const CyclesContext = createContext({} as CyclesContextType)

export function Home() {

  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycledID, setActiveCycleID] = useState<string | null>(null)    
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)
  
  const { newCycleForm } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues:{
      task: '',
      minutesAmount: 0,
    }
  })

  const { handleSubmit, watch, reset  } = newCycleForm

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycledID)

    function markCurrentCycleAsFinished(){
        setCycles( state => state.map(cycle => {
          if (cycle.id === activeCycledID){
            return{ ...cycle, finishedDate: new Date() } 
          } else {
            return cycle
          }
        }) 
      )
    }

    function setSecondsPassed(seconds: number){
      setAmountSecondsPassed(seconds)
    }

     function handleCreateNewCycle(data: NewCycleFormData){

      const id = String(new Date().getTime())
      
      const newCycle: Cycle = {
        id,
        task: data.task,
        minutesAmount: data.minutesAmount,
        startDate: new Date()
      }

      setCycles((state) => [...cycles, newCycle])
      setActiveCycleID(id)
      setAmountSecondsPassed(0)

      reset();
    }

    function handleInterruptCycle(){
      
      setCycles(state =>         
        state.map(cycle => {
          if (cycle.id === activeCycledID){
            return{ ...cycle, interruptDate: new Date() } 
          } else {
            return cycle
          }
        }),
      )

      setActiveCycleID(null)   

    }

    const task = watch('task')
    const isSubmitDisabled = !task;

  return (
  
    <HomeCountainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action=""> 

        <CyclesContext.Provider value={{ 
            activeCycle, 
            activeCycledID, 
            markCurrentCycleAsFinished,
            amountSecondsPassed,
            setSecondsPassed,
          }}>  

        <FormProvider {...newCycleForm}> 
          <NewcycleForm/>         
        </FormProvider>            
        <CountDown/>  

        </CyclesContext.Provider>

        { activeCycle ? (
          <StopCountDownButton onClick={handleInterruptCycle} type="button"> 
            <HandPalm size={24}/>
            Interromper 
          </StopCountDownButton>
        ) : (
          <StartCountDownButton  disabled={isSubmitDisabled} type="submit"> 
            <Play size={24}/>
            Começar 
          </StartCountDownButton>
        ) }

      </form>
    </HomeCountainer>
  
  )
}