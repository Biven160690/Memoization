// Что такое мемоизация?

// Мемоизация (Кэш) — пример использования кэша при разработке программного обеспечения,
// в программировании сохранение результатов выполнения функций для предотвращения повторных вычислений.
// Это один из способов оптимизации, применяемый для увеличения скорости выполнения компьютерных программ.
// Перед вызовом функции проверяется, вызывалась ли функция ранее:
// https://ru.wikipedia.org/wiki/%D0%9C%D0%B5%D0%BC%D0%BE%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F

// Как выглядит мемоизация в react? (немного обновим знания)

// React мемоизация используется для оптимизации производительности компонентов.
// Когда компонент рендерится, React проверяет изменения в его состоянии или свойствах. Если ничего не изменилось, React может пропустить повторный рендерин компонента, чтобы сэкономить ресурсы.
// Мемоизация позволяет кэшировать результаты выполнения функций, каких-то вычислений или компонентов, чтобы избежать лишних вычислений.
// В React для этого часто используется функция memo() или хуки useMemo() и useCallback().

// React.memo() - это высокоуровневая функция высшего порядка, которая оборачивает функциональный компонент и предотвращает его повторный рендеринг, если его пропсы не изменились.

// useMemo() - это хук, который позволяет мемоизировать результат выполнения функции, сохраняя его между рендерами компонента.
// Это особенно полезно, когда нужно выполнить сложные вычисления внутри компонента, и результат этих вычислений зависит только от изменения определенных пропсов в массиве зависимосте.

// useCallback() - это ещё один хук в React, который используется для мемоизации колбэк-функций. Он возвращает мемоизированную версию колбэк-функции, которая изменяется только при изменении одного из её зависимостей.

// Использование мемоизации может значительно улучшить производительность React-приложений, особенно если в приложении много компонентов или если у них много данных для обработки.

// Так же стоит учитывать что при мемоизации происходит выполнени дополнительной логики, выделение памяти и зачастую усложение кода.
// Всегда стоит измереть производительность перед тем как будешь использовать мемоизацию.
// В react когда компонент впервые монитируется при первом запуске useMemo или useCallback будет выполнять логика кешировани, использоваться дополнительная небольшая память, при использование memo
// будет так же будет выполнять логика кешировани, использоваться дополнительная небольшая память и в добавок создаваться новый компонет.
// При использовании только одного useMemo, useCallback или memo влияние небудет ощутимым. Но в больших приложениях, где их сотни разбросанных повсюду, это может ощутимо замедлить начальный рендеринга.

// Примеры использования мемоизации в react:

// useCallback и useMemo:

// ****СПИСОК ЗАВИСИСМОСТЕЙ (когда мы передаем в зависимости друго хука)

// #1

const Component = ({ data }) => {
    const submit = useCallback(() => {
        // something logic here
    }, []);

    const images = useMemo(() => {
        // something logic here
    }, [data]);

    useEffect(() => {
        submit();
        images; // something logic here
        // submit and images are memoized, so useEffect won't be triggered on every re-render
    }, [submit, images]);

    return; // something JSX;
};

// #2

const Child = ({ bar, baz }) => {
    const { items } = useCustomHook(bar, baz);

    const submit = useCallback(() => {
        // something logic here
    }, [bar]);

    const images = useMemo(() => {
        // something logic here
    }, [baz]);

    useEffect(() => {
        buzz(bar, baz);
    }, [bar, baz]);

    return; // something JSX;
};

const Parent = () => {
    const bar = useCallback(() => {
        // something logic here
    }, []);

    const baz = useMemo(() => {
        // something logic here
    }, []);

    return <Child bar={bar} baz={baz} />;
};

// ****ПРИМЕРНАЯ РЕАЛИЗАЦИЯ useCallback и useMemo

// примерно вот так происходит работа для useCallback

let cachedCallback;

const func = (callback) => {
    if (dependenciesEqual()) {
        return cachedCallback;
    }

    cachedCallback = callback;
    return callback;
};

// С useMemo все почти то же самое, только вместо возврата функцию, React вызывает ее и возвращает результат:

let cachedResult;

const func = (callback) => {
    if (dependenciesEqual()) {
        return cachedResult;
    }

    cachedResult = callback();
    return cachedResult;
};

// ****СЛОЖНЫЕ ВИЧИСЛЕНИЯ

// Прежде всего, что такое "дорогие вычисления"? Является ли конкатенация строк дорогостоящим? Или сортировка массива из 300 элементов? Или выполнение
// регулярное выражение в тексте из 5000 слов? Я не знаю. И вы не знаете. И никто не знает, пока это не будет реально измерено.
// представьте, что у вас есть функция, которая синхронно вычисляет значение, вычисление которого требует больших вычислительных затрат.
// Это может быть довольно медленно, но вы можете сделать так,
// чтобы вам никогда не приходилось вычислять одно и то же значение дважды подряд, и здесь useMemo вам подойдет

const Component = ({ iterations, multiplier }) => {
    const primes = useMemo(
        () => calculate(iterations, multiplier),
        [iterations, multiplier]
    );

    return <div>{primes}</div>;
};

// React.memo():

// #1

const Child = ({ data, onChange }) => {};
const ChildMemo = React.memo(Child);

const Component = () => {
    const data = useMemo(() => {
        // something logic here
    }, []);

    const onChange = useCallback(() => {
        // something logic here
    }, []);

    // data and onChange now have stable reference
    // re-renders of ChildMemo will be prevented

    return <ChildMemo data={data} onChange={onChange} />;
};

// #2

// Так же мы можем добавить свою проверку в React.memo для пропсов

function parentPropsAreEqual(prev, next) {
    return prev.data === next.data && prev.onChange === next.onChange;
}

const Child = ({ data, onChange }) => {};
const ChildMemo = React.memo(Child, parentPropsAreEqual);

// Но убедиться, что весь реквизит запомнен, не так просто, как кажется.
// Во многих случаях мы делаем это неправильно! И всего одна-единственная ошибка приводит
// к сломанной проверке реквизита и как следствие — каждому React.memo ,
// useCallback и useMemo становятся совершенно бесполезными.

// Мемоизация в кастомных хуках:

// #1
// стоит мемоизировать возрат данных так как они могу быть в зависимоятх у других хуков

export function useTimeout() {
    const run = useCallback(
        () => (handler: () => void, timeoutTime?: number) => {
            // some logic
        },
        []
    );

    const clear = useCallback(() => {
        // some logic
    }, []);

    return useMemo(
        () => ({
            run,
            clear,
        }),
        [clear, run]
    );
}

// стоит избегать лишней мемоизации если есть такая возможность

export function useTimeout() {
    return useMemo(
        () => ({
            run: () => {
                // some logic
            },
            clear: () => {
                // some logic
            },
        }),
        []
    );
}

// #2
// кэширование входящих данных чтоб не ломать мемоизацию

export const useInterval = (
    handler: () => void,
    delay: number | null = null
): ReturnType => {
    const handlerRef = useRef<() => void>(handler);
    const delayRef = useRef<number | null>(delay);
    const intervalId = useRef<NodeJS.Timeout | null>(null);

    useLayoutEffect(() => {
        handlerRef.current = handler;
        delayRef.current = delay;
    });

    const manageInterval = useMemo(() => {
        const start = () => {
            if (delayRef.current !== null) {
                intervalId.current = setInterval(
                    () => handlerRef.current(),
                    delayRef.current
                );
            }
        };

        const clear = () => {
            if (intervalId.current !== null) {
                clearTimeout(intervalId.current);
            }
        };

        return {
            start,
            clear,
            reset: () => {
                clear();
                start();
            },
        };
    }, []);

    return manageInterval;
};

// Примеры бессмысленной мемоизации в react:

// #1

// в данном случает нет смысла в useCallback так как Child
// будет перерендориваться при обновлении state или  пропрсов в родителе

const Child = ({ onClick, isDisabled, isHover }) => {
    //some JSX
};

const Parent = ({ isDisabled, isHover }) => {
    const [state, setState] = useState(0);

    const handleCloseClick = useCallback(() => {
        // some logic
    }, []);

    return (
        <div className="body">
            <div className="container">
                <Children
                    onClick={handleCloseClick}
                    isDisabled={isDisabled}
                    isHover={isHover}
                />
                <button onClick={() => setState((prev) => prev + 1)}>
                    Click me
                </button>
            </div>
        </div>
    );
};

// #2
// нет смысла оборачивать в useCallback и useMemo (если нет сложных вычислений) так как мы пеердаем в div

const Component = ({ type, isEnabled, onClick }) => {
    const handleOnClick = React.useCallback(
        () => {
            // some logic
        },
        [isEnabled, onClick]
    );

    const styles = useMemo(()=> {{}}, [])

    return <div onClick={handleOnClick} style={styles} />;
};

// #3

// в данном случает нет смысла в useCallback и useMemo так как ChildMemo принимает компонет
// (компонет это ведь простой обьект с необходимвми свойстами https://react.dev/reference/react/createElement#:~:text=LEGACY%20REACT%20APIS-,createElement,-createElement%20lets%20you) и
//  так как каждый раз при перерендоре будет создаваться новый компонет то значит и
// будет каждый раз новый обьект то memo  будет сломано, в данном случает нужно мемоизировать также и children

const Child1 = () => {
    return <div></div>;
};

const Child = ({ children, items, onClick }) => {
    return (
        <div className="">
            {children}
            {items.map((element) => {
                return <div className="">{element}</div>;
            })}
        </div>
    );
};

const ChildMemo = memo(Child);

const Parent = () => {
    const handleOnClick = useCallback(() => {}, []);
    const items = useMemo(() => {}, []);

    return (
        <div>
            <ChildMemo onClick={handleOnClick} items={items}>
                <Child1 />
            </ChildMemo>
        </div>
    );
};

// Чтобы это исправить, нам также нужно запомнить этот component

const Child1 = () => {
    return <div></div>;
};

const Parent = () => {
    const content = useMemo(() => <Child1 />, []);
    // или
    const content = useCallback(() => <Child1 />, []);

    const handleOnClick = useCallback(() => {}, []);
    const items = useMemo(() => {}, []);

    return (
        <div>
            <ChildMemo onClick={handleOnClick} items={items}>
                {content}
            </ChildMemo>
        </div>
    );
};

// вы подумаете а почему не React.memo

const ChildMemo = React.memo(Child);
const ParentMemo = React.memo(Parent);

const Component = () => {
    return (
        <ParentMemo>
            <ChildMemo />
        </ParentMemo>
    );
};

// ParentMemo будет вести себя так, как будто он не обернут в React.memo - его дети на самом деле не мемоизированы!
// ParentMemo принимает ChildMemo - это просто обьект с типом указывающем на компонет и  он не мемоизирован сам по себе.
// Итак, еще раз, с точки зрения мемоизации и реквизитов, у нас есть компонент ParentMemo у которого есть дочерний реквизит, содержащий не мемоизированный
// объект. Следовательно, нарушена мемоизация в ParentMemo.


// Рекомендации как можно обойтись без React.memo
// https://overreacted.io/before-you-memo/


// links:

// https://react.dev/reference/react/memo#should-you-add-memo-everywhere:~:text=Should%20you%20add%20memo%20everywhere%3F
// https://kentcdodds.com/blog/usememo-and-usecallback
// https://dmitripavlutin.com/use-react-memo-wisely/
