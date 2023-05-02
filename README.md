[![Coverage Status](https://coveralls.io/repos/github/lad-tech/nsc-toolkit/badge.svg?branch=main)](https://coveralls.io/github/lad-tech/nsc-toolkit?branch=main)
[![Known Vulnerabilities](https://snyk.io/test/github/lad-tech/nsc-toolkit/badge.svg)](https://snyk.io/test/github/lad-tech/nsc-toolkit)

## О библиотеке

`nsc-toolkit (NATS service creator toolkit)` 一 это набор инструментов для создания сервис-ориентированной архитектуры. 

Основная идеология тулкита заключается в установке минимального количества зависимостей, что позволяет создавать сервисы с помощью инструментов кодогенерации на основе простого описания в JSON-формате. 

Основным средством коммуникации между сервисами в обычном режиме работы является брокер сообщений [NATS](https://nats.io/). Применяются четыре основных способа:

1. Синхронный (`request`/`reply`) через брокер сообщений. Используется, если одному сервису, чтобы продолжать выполнять свою логику, требуются данные из другого сервиса.
2. События (`pub`/`sub`). События используются, когда сервису необходимо оповестить другие сервисы о произошедшем событии, но кто слушает и обрабатывает эти события, сервису неизвестно. Это дает возможность строить независимые между собой сервисы для создания архитектуры на основе событий 一 Event-driven architecture (EDA). 
3. Web-потоки на основе `HTTP 1.1`. Этот метод используется, если сервису требуется передать в другой сервис поток данных. Например, список из миллиона пользователей или любые другие объемные данные, включая бинарные. Тогда брокер выступает только как средство балансировки нагрузки и не участвует в передаче данных напрямую. Данные передаются с помощью web-потока из одного сервиса в другой через прямое соединение. Метод сервиса в качестве входных параметров может принимать поток данных и отдавать его в качестве ответа. 
4. Jet-streams используют возможности брокера NATS. Jet-streams похож на `pub`/`sub`, но предоставляет возможность хранить сообщения на самом брокере. Такой тип коммуникации позволяет реализовывать более безопасный способ общения между сервисами на основе событий. События, если на них нет подписчиков на текущий момент, не пропадут, а сохранятся на самом брокере. 

Все четыре способа коммуникации между сервисами реализуются средствами библиотеки и описываются в JSON.

## Возможности

* Простота и минимальное количество зависимостей за счет снижения уровня вариативности
* Схема взаимодействия `request`/`reply`
* Схема взаимодействия `pub`/`sub`
* Использование Web-streams
* Использование Jet-streams
* Сквозной таймаут для запросов
* Трассировки
* Межсервисное кэширование
* Валидация входных и выходных параметров методов сервиса на основе [JSON Schema](https://json-schema.org/).
* Логирование с учетом контекста
* Декораторы для инъекции зависимостей в методы сервиса
* Сервисный http-маршрут для проб, который поднимается вместе со стартом сервиса (доступен `GET [host]/healthcheck HTTP/1.1`)
* Сворачивание написанных сервисов в монолитное приложение без использования брокера NATS с сохранением всего спектра перечисленных функциональностей. Разные типы архитектуры (микросервисы или монолит) собираются из одной кодовой базы. Это может происходить параллельно в одном пайплайне CI/CD.

## Быстрый старт

Для обзора возможностей библиотеки рекомендуется использовать пример из каталога `examples`, который состоит из 3-х сервисов. Подробно реализация логики описана в пункте [Пример использования](#пример-использования). 

Для того, чтобы запустить пример, необходимо:

1. клонировать репозиторий с библиотекой и установить зависимости:

```
npm i
```

2. дополнительно зайти в каталог `examples` с сервисом `HttpGate`

```
cd ./examples/HttpGate
```

и установить там зависимости, так как для реализации HTTP-API используется библиотека Fastify:

```
npm i
```

3. после установки зависимостей можно запустить сервисы.

### Переменные окружения

 - `DEFAUL_RESPONSE_TIMEOUT` 一 внешнее ограничение тайм-аута при запросе в секундах. Используется при первоначальном формировании времени тайм-аута в багаже по формуле `Date.now() + DEFAULT_RESPONSE_TIMEOUT`;
 - `OTEL_AGENT` 一 хост агента по сбору распределенных трассировок.

## Основные компоненты библиотеки

Для реализации сервисов используются следующие компоненты:

1. Файл service.json


## Пример использования

Пример использования инструментов тулкита находится в каталоге `examples`. 

Все три сервиса созданы для реализации тестовой логики "Странная сумма": 
1. Во вход необходимо передать два числа a и b. 
2. На первом этапе логика сервисов сложит эти два числа между собой. Полученная сумма будет использована в качестве максимального количества чисел из ряда Фибоначчи. 
3. На последнем этапе, получив последовательность чисел, логика сложит их между собой и вернет ответ. 

### Описание каталога `examples`

1. `HttpGate` 一 cервис предоставляет http api с одним маршрутом `POST /math/weird/sum`. В качестве тела запроса необходимо передать json. Например: 

```json
{
  "a": 5,
  "b": 5
}
```

После получения запроса сервис HttpGate синхронно через брокер вызывает сервис Logic и, получив от него ответ, возвращает результат в качестве ответа на запрос.

2. `LogicService` 一 сервис реализует логику "Странной суммы". Сам сервис ничего не вычисляет, а лишь использует другой сервис `MathService`:
  - Получив два числа от `HttpGate`, `LogicService` синхронно вызывает метод сервиса `Math.sum`, который складывает два переданных числа. 
  - Затем сервис вызывает метод `Math.Fibonnacci`, в который передает результат предыдущего действия и в качестве ответа получает поток с числами Фибоначчи.
  - Получив поток чисел, сервис передает этот поток в метод `Math.SumStream`, который складывает все числа в потоке и в ответе возвращается одно число, которое и является "Странной суммой".
  - В завершении последней операции сервис генерирует событие `Elapsed`, в которое передает затраченное на выполнение вычислений время.

3. `MathService` 一 сервис реализует 3 метода: `Sum`, `Fibonacci` и `SumStream`, описанные выше. Помимо этих методов, сервис генерирует также два события:
  - При вызове метода `SumStream` сервис генериует обычное событие `Notify`.
  - После завершения вычислений сервис генерирует событие `Elapsed`, в которое передает затраченное на выполнение вычислений время. Событие `Elapsed` описано как Jet-stream.


В результате запросов к тестовым сервисам генерируются трассировки следующего вида:

![Таймлайн](./examples/misc/trace_1.png)

![Таймлайн](./examples/misc/trace_1.png)
 
 ## Схема описания сервиса

Сервисы описываются в JSON-файле.

Схема:

```json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "methods": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "action": { "type": "string" },
          "description": { "type": "string" },
          "options": { "$ref": "#/$defs/options" },
          "request": { "type": "object" },
          "response": { "type": "object" }
        },
        "required": [ "action", "description", "options" ]
      }
    },
    "events": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "description": { "type": "string" },
          "message": { "type": "object" }
        },
        "required": [ "action", "description", "options", "message" ]
      }
    }
  },
  "required": [ "name", "description", "methods" ],

  "$defs": {
    "options": {
      "type": "object",
      "properties": {
        "useStream": {
          "type": "object",
          "properties": {
            "request": { "type": "boolean" },
            "response": { "type": "boolean" }
          }
        },
        "cache": { "type": "number" },
        "runTimeValidation": {
          "type": "object",
          "properties": {
            "request": { "type": "boolean" },
            "response": { "type": "boolean" }
          }
        }
      }
    }
  }
}
```

- `name` 一 название сервиса;
- `description` 一 описание сервиса;
- `methods` 一 набор методов для реализации схемы `request`/`reply`;
  - `action` 一 идентификатор запроса;
  - `description` 一 описание метода;
  - `request` 一 JSON Schema входных данных;
  - `response` 一 JSON Schema выходных данных;
  - `options` 一 настройки метода;
    - `useStream` 一 использование Web-стримов для входных и выходных данных;
      - `request` 一 Web-стрим на входе;
      - `response` 一 Web-стрим на выходе;
    - `cache` 一 кэширование запроса (задается в минутах);
    - `runTimeValidation` 一 использование runtime для валидации параметров;
      - `request` 一 для входных данных;
      - `response` 一 для выходных данных;
- `events` 一 набор событий, генерируемый сервисом для реализации схемы `pub`/`sub`;
  - `name` 一 идентификатор события;
  - `description` 一 описание события;
  - `event` 一 JSON Schema события.