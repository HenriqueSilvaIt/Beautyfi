import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetFlatList,
} from "@gorhom/bottom-sheet"; /*Importação do bottom sheet
da biblioteca do bottom sheet, BottomSheetScrollView é no caso passarmos um conteúdo com componente maior
ele vai criar uma scroll view barra de rolagem */
import { TouchableWithoutFeedback, View } from "react-native";
import { colors } from "../../styles/colors";

interface BottomSheetContextType {
  openBottomSheet: (
    content: React.ReactNode,
    index: number,
  ) => void; /*Função para abrir o  
    bottomSheet, ela recebe um content que é o React.ReactNode que quer
    dizer que é um componente React, isso vai permirti reaproveitar código */
  closeBottomSheet: () => void; /*função para fechar
    o bottomSheet */
}

/*Esse vai ser o nosso contexto, vamos usar o createContext  do react */
export const BottomSheetContext = createContext({} as BottomSheetContextType);

/*Provider onde vamos englobar toda aplicação, ele recebe um children como um parâmetro
toda aplicação é recebida como parâmetro dentro do nosso contexto*/
export function BottomSheetProvider({ children }: PropsWithChildren) {
  /*PropsWithChildren é para quando desistruturarmos 
    as propridades do provider, nós termos acesso aos componentes filhos do nosso provider */

  /*Nesse estado vamos armazenar o componente react
    que vai ser exibido no nosso bottom sheet */
  const [content, setContent] = useState<React.ReactNode | null>(null);

  const bottomSheetRef =
    useRef<BottomSheet>(null); /*useRef é do react, serve para criarmos
    referências dentro do nosso componente, assim conseguimos ver propridade
     e criar um comportamento dentro de algum componente específico sem precisar
     criar um estado, nós utilizamos as propridades do próprio componente como BottomSheet*/

  const snapPoints = [
    "70%",
    "90%",
  ]; /*esse atributo vai passar o limite da tela que o 
    bottom sheet vai poder ocupar quando abrirmos o bottomSheet ele vai iniciar com 70% 
    podendendo se estender até 90%  */

  const [index, setIndex] = useState(-1); /*isso é um index que vai no 
    bottomSheet ele vai começar com -1 porque isso indica que nosso bottom sheet deve 
    estar fechado por padrão */

  const [isOpen, setIsOpen] =
    useState(false); /*Estado para ver se componente bottomSheet
    está aberto ou fechado e vai ser parecido com o teclado vamo criar uma condional
    para quando criar foram da tela ele vai fecha o bottomSheet*/

  /*Função de abrir bottomSheet 
    toda vez que chamarmos essa função 
    vamos enviar nossa componente para o bottomSheet
    seja o componente nova transação, editar transação ou filtro */
  const openBottomSheet = useCallback(
    (newContent: React.ReactNode, index: number) => {
      setIndex(index); /*para sumir ou fazer aparecer o componente*/
      setContent(newContent); /*aqui vamos passar o componente
            filtro, nova ou editar transação */
      setIsOpen(true); /*como o is Open está como true
            ele vai exisbit o componente na tela  */
      requestAnimationFrame(() => {
        bottomSheetRef.current?.snapToIndex(index);
        /*Neessa callback nessa função, o snapToIndex defini
                qual altura o nosso bottom sheet vai estar
                se o index  estiver 0 nosso bottom sheet vai abrir ocupando 70% da nossa tela
                se tiver 1 vai abrir ocupando 90% da nossa tela
                como o valor inicial do index colocamos -1 o bottomSheet meio que está fechado
                o requestAnimationFrame  garanti com que a função snapToIndex seja executado só depois
                do React aplicar as devidas alterações na nossa referencia  bottomSheetRef 
                como colocamos ela para começar como nulo dessa forma a gente garante que a gente chame o 
                snapToIndex após nós setarmos todas as referências que passamos no nosso componente: 

                 <BottomSheet
            ref={bottomSheetRef} passandro atributo que criamos usando useRed
            snapPoints={snapPoints}  /*esse atributo vai passar o limite da tela que o 
                bottom sheet vai poder ocupar quando abrirmos o bottomSheet ele vai iniciar com 70% 
                podendendo se estender até 90%  caso seja um componente maior ou caso nós arraste ele para cima
            style={{zIndex: 2}} /*Aqui é como o traze para frente do powert point 
                /*Como colocamos BottomSheetContext dentro do APP.tsx tudo que passarmos aqui
                dentro do provider, ficara disponível em toda aplicação, inclusive esse bottom sheet
            index={index}
        >
                */
      });
    },
    [],
  );

  /*Função de fechar bottomSheet */
  function closeBottomSheet() {
    setIsOpen(false); /*apontar que está fechado o bottomSett */
    setContent(null); /*quando fecharmos o nosso bottom sheet
        vamos setar o valor para nulo, para n aparecer na tela*/
    setIndex(
      -1,
    ); /*para empurrar o bottom sheet para trás como ele estivesse fechado*/
    bottomSheetRef.current?.close(); /*current é uma propriedade do componente BottomSheet
        por isso que tipamos o bottomSheetRef com useRef para usar essa propriedade, estamos
        dizer qui que ele estpa fechado */
  }

  /*Função para fechar o bottomSheet */
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setIsOpen(false);
    }
  }, []);

  return (
    <BottomSheetContext.Provider
      /*Ele espera receber um objeto que é do tipo BottomSheetContextType que criamos
        todas as propriedades que estiverem dentro do value, serão acessíveis dentro do nosso children
        ou seja dentro de todos os outros componentes de nossa aplicação*/
      value={{
        openBottomSheet,
        closeBottomSheet,
      }}
    >
      {children}

      {isOpen && (
        <TouchableWithoutFeedback
          onPress={closeBottomSheet} /*esse botão
                vai fechar o bottomSheet quando clicarmos caso o isOpen for verdadeiro */
        >
          <View
            className="absolute inset-0 bg-black/70 z-1"
            /*absolute para deixarmos ele flutuar na tela 
                    z-1 (é zIndex 1 Para garantirmos que esse componente sempre fique abaixo do nosso bottom sheet)
                     */
          ></View>
        </TouchableWithoutFeedback>
      )}

      <BottomSheet
        handleIndicatorStyle={{
    backgroundColor: colors.white, // ✅ a barrinha do handle
  }}
        ref={bottomSheetRef} /*passandro atributo que criamos usando useRef */
        enableDynamicSizing={false}
        snapPoints={
          snapPoints
        } /*esse atributo vai passar o limite da tela que o 
                bottom sheet vai poder ocupar quando abrirmos o bottomSheet ele vai iniciar com 70% 
                podendendo se estender até 90%  caso seja um componente maior ou caso nós arraste ele para cima*/
        style={{
          zIndex: 2,
        }} /*Aqui é como o traze para frente do powert point */
        /*Como colocamos BottomSheetContext dentro do APP.tsx tudo que passarmos aqui
                dentro do provider, ficara disponível em toda aplicação, inclusive esse bottom sheet */
        index={index}
        enablePanDownToClose /*Para conseguirmos fechar o bottomSheet arrastando para baixo
            com mouse ou  dedo */
        backgroundStyle={{
          backgroundColor:
            colors["background-quartenary"] /*estamos usando nosso colors */,
          borderTopLeftRadius: 32 /*borda superior a esquerda */,
          borderTopRightRadius: 32 /*borda superior a esquerda */,
          elevation: 9 /*Cria um sombreado no componente */,
        }}
        onChange={
          handleSheetChanges
        } /*para fechar o botão quando fechar botão quando clicarmos foram
            do nosso bottom sheet */
      >

          /*bottomSheetScroview cria uma barra de rolagem caso
            o coponente seja muita grande e o content é  o componente
            que vamos passar para ser exibido no bottom sheet */
   
          {content}
      </BottomSheet>
    </BottomSheetContext.Provider>
  );
}

/*Criação de hook para facilitara a utilização do content 
dessa forma chamado essa função conseguindo pegar todas as funções ou estados
que criamos aqui dentro*/
export function useBottomSheetContext() {
  /*Use context espera um contexto (ou seja variavel
    que criamos com createContext do react) como parâmetro */
  return useContext(BottomSheetContext);
}
