# Roguelike

## Команда

- Илья Иванцов
- Доморацкий Эридан

## Архитектурная документация

### Служебная информация

**Название:** Roguelike

**Авторы:** Доморацкий Эридан, Иванцов Илья

**Дата:** 08.06.2023

### Общие сведения о системе

#### Назначение системы

Система является однопользовательской пошаговой игрой в жанре roguelike с видом сверху,
доступной для использования с помощью Web-браузера. Пользовательский интерфейс предоставляется
в графическом виде с управлением при помощи клавиатуры и без использования мыши.

#### Описание границ системы

- Система является игрой
- Жанр игры roguelike
- Система однопользовательская (никакие два пользователя не могут коммуницировать
  посредством использования системы)
- Управление игровым процессом происходит исключительно с помощью клавиатуры
- Внутриигровой мир двумерный
- Игра является пошаговой, все игровые механики срабатывают исключительно во время хода игрока
- Внутриигровые механики не используют технологии искуственного интеллекта, все действия
  определяются детерминировано или с использованием генератора псевдо-случайных чисел
- Все игровые объекты привязаны к целочисленной координатной сетке, как местоположение,
  так и размеры
- Система не использует звуковое сопровождение, никакие звуки не проигрываются на компьютере в
  связи с использованием системы
- Система не предназначена для работы на мобильных устройствах (и на устройствах без аппаратной
  клавиатуры или с размером монитора менее 1366x768)

#### Описание контекста

- Система работает в рамках одной web-страницы
- Система не использует никакие устройства ввода, кроме клавиатуры

### Ключевые требования (architectural drivers)

#### Технические ограничения

- Web-браузер должен поддерживать CanvasRenderingContext2D API
- Web-браузер должен поддерживать ECMAScript 5

#### Бизнес-ограничения

- Разработка системы должна быть завершена к моменту сдачи экзамена (12.06.2023)

#### Качественные характеристики системы

- Высокая сопровождаемость системы, архитектура должна быть устойчива к внедрению новых
  функциональных возможностей (типов игровых объектов, игровых механик)
- Производительность, достаточная для комфортной работы (без видимых проблем с частотой кадров
  и реакцией на пользовательский ввод) на компьютере с процессором Intel Core i5 8th Gen
- Объём потребляемой памяти открытой вкладкой в Web-браузере не должен превышать 1 Гб
- Хорошая тестируемость системы, компоненты должны быть спроектированы и реализованы так,
  чтобы трудозатраты на написание unit-тестов не превосходили трудозатрат на реализацию

#### Ключевые функциональные требования

- Система предоставляет графический пользовательский интерфейс с тайловой графикой
- В игре должен присутствовать ровно один персонаж, управляемый при помощи клавиатуры
- В игре должны присутствовать предметы экипировки, влияющие на характеристики персонажа
- Должна быть доступна генерация случайного мира и загрузка из файла

<!--
Ограничения для второй части задания:
- В игре должны присутствовать враждебные существа,
  с которыми игровой персонаж может вступить в бой
- Бой происходит автоматически, исходя из игровых характеристик персонажа
-->

#### Нефункциональные требования

- Визуальная составляющая игры должна быть реализована с использованием изображений (текстур),
  а не только с помощью графических примитивов
- Вид на игрока должен быть анимирован, "камера" должна перемещаться не мгновенно
- Текущее количественное значение здоровья игрока должно выводиться на экран красным цветом
- Перемещение персонажа должно происходить при помощи клавиш W, A, S, D
- Формат файла игрового мира должен быть человеко-читаемым для возможности ручного редактирования
  в текстовом редакторе

### Роли и случаи использования

Предусмотрены следующие роли:

- Игрок
- Дизайнер миров

Ниже описываются случаи использования каждой из этих ролей.

#### Игрок

- Играть в случайно сгенерированном мире
- Играть в мире, загруженном из файла
- Управлять перемещением персонажа в игровом мире
- Подбирать предметы из игрового мира и выбрасывать их в игровой мир
- Использовать и экипировать предметы, находящиеся в инвентаре
- Узнать текущее и максимальное значение здоровья
- Узнать текущее значение силы атаки и брони
- Узнать текущее местоположение персонажа относительно игровых объектов, расположенных неподалёку

#### Дизайнер миров

Роль расширяет роль Игрок.

- Создавать игровые миры путём редактирования файла в текстовом редакторе

### Описание типичного пользователя

![Фотография типичного пользователя](https://avatars.githubusercontent.com/u/28118638)

**Сергеев Иван Ильич**, мужчина, 25 лет

Любит игры в жанре roguelike. Много играет в современные компьютерные игры, поэтому привык
управлять персонажем с помощью клавиш W, A, S, D. Любит стратегические игры, нежели чем экшен,
поэтому более расположен к пошаговым играм. Без ума от плавающих камер в играх. Хотел бы видеть
себя в образе главного героя игры. Очень любит майнкрафт и мод Giselbaer's Durability Viewer.

### Контекст

Система является однопользовательской игрой в жанре roguelike с двумерной тайловой графикой,
управляемой с клавиатуры. Игровой мир также является двумерным, игрок видит мир сверху.
Игра является пошаговой, поэтому все внутриигровые механики действуют только в момент хода игрока.
В игровом мире должны присутствовать предметы, которые игрок может подобрать, после чего они
появляются в его инвентаре. Любой предмет в инвентаре может быть выброшен в игровой мир, либо
использован. Действие, сопровождающее использование предмета, зависит от типа предмета.
В игре должны присутствовать предметы, которые персонаж может надеть на себя в качестве экипировки,
при этом надетые предметы должны влиять на характеристики персонажа. Персонаж должен обладать
такими характеристиками, как здоровье, сила урона и защита. Персонаж может свободно перемещаться
по игровому миру, за исключением позиций, в которых стоит непреодолимое препятствие (например,
стена). Игровой мир представляется как условно-бесконечная (не ограниченная ничем, кроме
технических ограничений среды исполнения) целочисленная координатная сетка, поэтому все игровые
объекты, в том числе персонаж, могут находиться только на целочисленных позициях и иметь
целочисленный размер, выражающийся в количестве клеток коорднатной плоскости. Игрок должен иметь
возможность узнать текущие характеристики персонажа.

### Композиция

На верхнем уровне абстракции систему можно рассматривать как два компонента: шина событий и
игровая логика.

**Шина событий (event bus)** предназначена для обмена общесистемными событиями, такими как события
web-браузера. Также сюда входят текущее состояние и обработчики событий. Обработчики событий
выполняют роль контроллеров (аналогия из MVC), полностью отделяя игровую логику от особенностей
среды исполнения. Текущее состояние используется обработчиками событий для хранения общего
(распределённого между обработчиками) состояния, например, текущего игрового мира.

**Игровая логика** включает в себя непосредственно всю игровую логику и также логику отображения
игровых объектов на экране. Точкой входа в игру является игровой мир, который содержит в себе всю
игровую информацию, а внутри него расположены более простые игровые объекты.

**Генератор мира** отвечает за различные способы генерации игрового мира и игровых объектов.
В частности он предоставляет возможность сгенерировать мир случайно или загрузить из файла.

![Диаграмма компонентов](./uml/components.drawio.png)

### Логическая структура

Вне компонентов существует инициализирующий скрипт, создающий экземпляры компонентов и
настраивающий их, а также преобразовывающий DOM-события в события **Шины событий**. Скрипт
загружается во время загрузки страницы (не после полной загрузки, а непосредственно во время)
с помощью HTML-тега script, расположенного в конце странице (чтобы на момент запуска HTML-тег
canvas уже был доступен в DOM).

#### Шина событий

Компонент **Шина событий** состоит из классов, описывающих конкретные типы событий, которые
принимает на вход класс **EventBus** и передаёт конкретным обработчикам событий, классы которых
также включены в этот компонент. Также определено несколько классов состояний, которые может
содержать объект **EventBus**. Все обработчики событий реализуют интерфейс **EventHandler**.

Типы событий:

- **BaseEvent** — базовый интерфейс для всех событий,
- **DomEvent** — базовый интерфейс для всех событий DOM,
- **LoadEvent**, **ResizeEvent** — события, отправляющиеся при возникновении DOM-событий
  загрузки и изменения размера окна, служат для обновления конфигурации HTML-тега canvas,
- **KeyDownEvent** — событие, отправляющееся при нажатии клавиши на клавиатуре,
- **TickEvent** — событие, отправляющееся не чаще, чем 60 раз в секунду,
  служит для воспроизведения анимаций и отрисовки кадров,
- **Event** — общий тип для всех событий конкретного типа.

**TickEvent** отправляется регулярно для того, чтобы все анимации могли быть воспроизведены
при условии, что каждый кадр анимации отображается во время обработки очередного **TickEvent**.
Гарантируется, что событие не будет отправляться чаще, чем 60 раз в секунду.

Типы состояний:

- **BaseState** — базовый интерфейс для всех типов состояний;
- **GameState** — тип состояния, использующегося во время игры;
- **MainMenuState** — тип состояния, использующегося для главного меню игры;
- **State** — общий тип для всех состояний конкретного типа.

Обработчики событий:

- **CanvasClearEventHandler** — реагирует на событие **TickEvent** и очищает холст для рисования
  нового кадра,
- **InitEventHandler** — реагирует на события **LoadEvent** и **ResizeEvent** и изменяет размеры
  HTML-тега canvas в соответствии с текущим размером окна,
- **MainMenuEventHandler** — отвечает за работу с главным меню игры,
- **GameWorldEventHandler** — отвечает за отрисовку игрового мира и перемещение персонажа,
- **GameInterfaceEventHandler** — отвечает за отрисовку игрового интерфейса (инвентарь и
  характеристики персонажа) и работу управление инвентарём персонажа,
  а также за выход в главное меню,
- **DebugInfoEventHandler** — отвечает за отображение и скрытие отладочной информации,
- **ChangePreviousUpdateTimeEventHandler** — реагирует на событие **TickEvent** и обновляет
  значение времени, когда был нарисован предыдущий кадр, которое используется для отрисовки
  анимаций.

![Диаграмма классов компонента Шина событий](./uml/event_bus_classes.drawio.png)

#### Игровая логика

Компонент **Игровая логика** состоит из классов, описывающих игру (доменная модель).

Точкой входа является класс **GameWorld**, обладающий полной информации обо всём игровом мире.
Он содержит в себе список объектов, расположенных в игровом мире, включая объект персонажа.
Также игровой мир реализует интерфейс **Drawable**.

Интерфейс **Drawable** предоставляет единственный метод *draw*, отвечающий за рисование объекта
на холсте.

Интерфейс **Collider** предоставляет единственный метод *collides*, отвечающий на вопрос,
пересекает ли объект заданную точку в игровом мире.

Для представления точек, векторов и габаритов в двумерном пространстве используется утилитарный
класс **Coordinates**, который не входит в компонент **Игровая логика**. Класс предоставляет
свойства *x* и *y*, а также набор утилитарных методов для операций над координатами, который
будет определяться по необходимости программистом.

Все игровые объекты реализуют интерфейс **GameObject**, который, в свою очередь, наследуется от
интерфейсов **Drawable** и **Collider**. Кроме этого интерфейс предоставляет свойства
*coordinates*, содержащее текущее местоположение объекта в игровом мире (его левый верхний угол),
и *isPassable*, отвечающее на вопрос, может ли другой объект проходить сквозь объект (например,
для стен это свойство имеет ложное значение, а для предметов — истинное).

Типы игровых объектов:

- **Trigger** — интерфейс, определяющий игровой объект, реагирующий на соприкосновение с
  персонажем (когда персонаж оказывается на одной из клеток игрового мира, которую пересекает
  объект);
- **Player** — персонаж, содержит в себе инвентарь, текущее и максимальное значения здоровья,
  базовые значения силы атаки и брони, а также список экипированных предметов;
- **Wall** — стена, содержит булеву матрицу, определяющую форму стены (для оптимизации, чтобы
  каждая отдельная клетка стены не была отдельным объектом);
- **DroppedItem** — выборшенный предмет, содержит в себе предмет, реализует интерфейс **Trigger**.

Класс **Inventory** представляет инвентарь персонажа и содержит в себе список предметов и номер
текущего выбранного слота инвентаря. Список предметов и номер выбранного слота ограничены
количеством слотов инвентаря — девять. Предоставляет методы для взаимодействия с текущим предметом
и изменения номера выбранного слота.

Интерфейс **Item** является общим для всех предметов, расширяет интерфейс **Drawable**,
предоставляет метод *useItem*, реализующий использование предмета игроком.

Интерфейс **Equipment** расширяет интерфейс **Item** и является общим для всех предметов, которые
можно экипировать. Предоставляет свойства *equipmentType* и *equipmentBonus*, показывающие, на
какие характеристики персонажа и каким образом влияет экипировка предмета.

Типы предметов:

- **GoldenApple** — предмет, увеличивающий показатель здоровья персонажа на 0.2 от максимального
  здоровья при использовании;
- **Sword** — предмет, который при экипировке добавляет пять единиц к силе атаки персонажа.

![Диаграмма классов компонента Игровая логика](./uml/game_logic_classes.drawio.png)

#### Генератор мира

Компонент **Генератор мира** содержит классы и интерфейсы для генерации игрового мира
и игровых объектов.

Интерфейс **Generator** предоставляет один метод *generate*, принимающий генератор случайных
чисел (для возможности параметризации зерна) и возвращающий сгенерированный объект.

Интерфейсы **ItemGenerator** и **WorldGenerator** специализируют **Generator** для предметов и
игрового мира соответственно.

Класс **UniformItemGenerator** позволяет генерировать предметы с заданным дискретным
распределением, которое описывается таблицей относительных вероятностей. Реальная вероятность
вычисляется как отношение относительной вероятности к сумме всех относительных вероятностей.

Класс **FileWorldGenerator** реализует детерминированный **WorldGenerator**, обрабатывающий
текст с описанием игрового мира, и строящий игровой мир исходя из текстового описания. Формат
файла описан в точке зрения Информационная структура.

Класс **BoxedWorldGenerator** реализует **WorldGenerator**, генерирующий мир, состоящий из
одинаковых прямоугольных комнат, соединённых проходами. В каждой такой комнате может появиться
случайное количество предметов, которые генерируются с помощью **ItemGenerator**. Параметризуется
размером комнаты, максимальными количеством предметов в комнате, генератором предметов и
максимальной глубиной дерева генерации. Алгоритм генерации описан в точке зрения Алгоритмы.

![Диаграмма классов компонента Генератор мира](./uml/world_generator_classes.drawio.png)

### Информационная структура

#### Формат файла игрового мира

Описание синтаксиса файла игрового мира для **FileWorldGenerator** в РБНФ:

```ebnf
File = WorldSize Walls { HoleFiller }.
WorldSize = Nat Nat "\n".
Walls = { WallsRow }.
WallsRow = { WallsCell } "\n".
WallsCell = "W" | "." | Nat.
HoleFiller = Nat "." HoleFillerName HoleFillerData "\n".
HoleFillerName = "Player" | "Item".
```

- `Nat` — любое натуральное число
- `HoleFillerData` — `[^\n]*`

Также требуется, чтобы число `WallsRow` в `Walls` совпадало со вторым числом в `WorldSize`
(высота мира) и число `WallsCell` в каждом `WallsRow` совпадало с первым числом в `WorldSize`
(ширина мира). Первым числом в `HoleFiller` может быть только одно из чисел, содержащихся в
качестве значения `WallsCell`.

Семантика:

- Первая строка задаёт ширину и высоту мира.
- `W` в ячейке мира задаёт стену.
- `.` в ячейке мира задаёт пустоту.
- Число в ячейке мира задаёт "hole", который можно заполнить с помощью нуля,
  одного или нескольких заполнителей.
- Заполнитель `Player` размещает в указанном "hole" персонажа.
  Если используется больше одного раза, приоритет отдаётся последнему,
  если не используется ни разу, персонаж размещается в позиции $`(0, 0)`$.
- Заполнитель `Item` требует в качестве `HoleFillerData` значение `Sword` или `GoldenApple` и
  размещает в "hole" соответствующий предмет.

### Использование шаблонов

Реализации интерфейса **Drawable** образуют вложенную структуру и следуют структурному шаблону
проектирования Компоновщик. Так, объект класса **GameWorld** включает в себя множество объектов
типа **GameObject**, среди которых есть игрок и могут быть объекты класса **DroppedItem**.
Каждый **DroppedItem** содержит в себе **Item**, что позволяет использовать метод *draw* вложенных
объектов при отрисовке менее вложенных. Аналогично, при отрисовке **Inventory** используются методы
*draw* предметов, хранящихся в нём.

Компонент **Шина событий** реализует шаблон Посредник, где класс **EventBus** выступает в роли
посредника. Таким образом, из любой части системы может быть отправлено событие, которое оповестит
все части системы.

### Взаимодействия

#### Распространение события

При отправке события в **Шину событий** оно распространяется по всем обработчикам в определённой
последовательности, не меняющейся от события к событию.

![Диаграмма последовательности обработки события](./uml/event_propagation_sequence.drawio.png)

#### Отрисовка игрового мира

При обработке события **TickEvent** обработчиком **GameWorldEventHandler** выполняется отрисовка
игрового мира.

Ниже проиллюстрирован пример отрисовки части игрового мира, в котором размещён **DroppedItem** и
**Wall**.

![Диаграмма последовательности отрисовки игрового мира](./uml/game_world_draw_sequence.drawio.png)

### Динамика состояний

... переход от главного экрана к игре и наоборот ...

### Алгоритмы

... алгоритм генерации мира ...

### Ресурсы

... шрифты из Google Fonts ...
